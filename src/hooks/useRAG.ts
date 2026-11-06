// web-llm is huge (~1MB+ of JS on the ~500MB model it fetches): it only
// enters through a DYNAMIC import inside the loading path, so it never
// rides the critical bundle — the module downloads when the chat first
// asks for the engine, not on site load. Types come in type-only (they
// are erased at build, no runtime import).
import type { ChatCompletionMessageParam, MLCEngineInterface } from "@mlc-ai/web-llm";
import {useState, useCallback, useEffect} from 'preact/hooks'
import { RAGResult, RAGStatus, StreamOptions } from "../types";
import { RESUME_CONTEXT } from "../data/resume";

const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

const SYSTEM_PROMPT = `You are an assistant answering questions about Elie's background and experience.
Use the resume data below to answer accurately. Be concise and specific.

RULES:
1. Only answer based on the resume data below
2. If the answer is not explicitly in the resume, say exactly: "I don't have that information in the resume"
3. Do not invent companies, projects, dates, or roles
4. Do not combine or infer information
5. Quote directly from the resume when possible
6. Elie uses she/her pronouns
7. IMPORTANT: Elie IS available for work - she prefers full-time positions but is open to contract work, especially contract-to-hire
8. IMPORTANT: Elie does NOT know C# or any C-family languages (C, C++, C#). Her languages are: TypeScript, JavaScript, HTML5, CSS3, SCSS, Ruby, Python

EXAMPLES:
Q: "Where did Elie work?"
A: "Elie worked on e-commerce clients including Reformation, Brooks Brothers & Forever 21"

Q: "Did Elie work at Google?"
A: "I don't have that information in the resume"

Q: "What's Elie's favorite color?"
A: "I don't have that information in the resume"

Q: "Is Elie available for work?"
A: "Yes, Elie is available for work. She prefers full-time positions but is open to contract work, especially contract-to-hire."

Q: "Does Elie know C#?"
A: "No, Elie does not know C#. Her programming languages are TypeScript, JavaScript, HTML5, CSS3, SCSS, Ruby, and Python."

Q: "Can Elie develop in C++?"
A: "No, Elie does not know C++. Her programming languages are TypeScript, JavaScript, HTML5, CSS3, SCSS, Ruby, and Python."

RESUME DATA:
${RESUME_CONTEXT}
`;

// The engine is the app's one instance and lives at module scope.
// Routes are mounts; hook-held state dies at every unmount.
// A round-trip to another page re-read Idle and claims "Model Not
// Loaded." over weights the browser already holds (no refetch —
// the network tab stays clean). The store holds the live truth and
// mounted hooks subscribe to it. An in-flight load keeps ticking with
// no subscribers; re-entering the chat shows its true state, error
// included, until a send retries.
const engineStore: {
  engine: MLCEngineInterface | null,
  status: RAGStatus,
  progress: number,
  listeners: Set<() => void>,
} = {
  engine: null,
  status: RAGStatus.Idle,
  progress: 0,
  listeners: new Set()
};

function notifyEngineListeners() {
  for (const listener of engineStore.listeners) listener();
}

function subscribeToEngine(listener: () => void) {
  engineStore.listeners.add(listener);
  return () => {
    engineStore.listeners.delete(listener);
  };
}

const ensureEngine = async (): Promise<MLCEngineInterface | null> => {
  // Ready and in-flight loads return the one engine; Idle and a failed
  // load start (or retry) it, so a send in the chat retries after an error
  if (engineStore.engine || engineStore.status === RAGStatus.Loading) {
    return engineStore.engine;
  }
  engineStore.status = RAGStatus.Loading;
  engineStore.progress = 0;
  notifyEngineListeners();
  try {
    // the dynamic import — the first point of contact with the
    // (large) engine module, off the critical bundle
    const webllm = await import('@mlc-ai/web-llm');
    engineStore.engine = await webllm.CreateMLCEngine(MODEL_ID, {
      initProgressCallback: (p) => {
        engineStore.progress = Math.round((p.progress || 0) * 100);
        notifyEngineListeners();
      },
    });
    engineStore.status = RAGStatus.Ready;
    notifyEngineListeners();
  } catch (e) {
    engineStore.status = RAGStatus.Error;
    // the engine load failed — the operation + the model stay in
    // the log so the failure is diagnosable; the rethrow reaches
    // the caller (universal.md: no silent failure)
    console.error('useRAG: web-llm engine load failed', { model: MODEL_ID }, e);
    notifyEngineListeners();
    throw e;
  }
  return engineStore.engine;
};

const useRAG = (): RAGResult => {
  // The first-paint rule (preact.md): the snapshot initializes from the
  // store's live state, so a remount never paints a false Idle frame
  // over a model that is Ready, loading, or failed
  const [loadState, setLoadState] = useState(() => ({ status: engineStore.status, progress: engineStore.progress }));

  // The subscription rides this hook's mount while the store outlives
  // it; the cleanup's remover keeps updates off unmounted state
  useEffect(() => subscribeToEngine(() => {
    setLoadState({ status: engineStore.status, progress: engineStore.progress });
  }), []);

  const [text] = useState('');

  const stream = useCallback(async function* (
      messages: ChatCompletionMessageParam[],
      opts: StreamOptions = {},
    ): AsyncGenerator<string> {
    await ensureEngine();
    const engine = engineStore.engine;
    if (!engine) return;

    // Inject system prompt with resume context
    const messagesWithContext: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await engine.chat.completions.create({
      messages: messagesWithContext,
      stream: true,
      max_tokens: 500,
      temperature: 0.3,
      ...opts,
    });
    for await (const chunk of response) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }, []);

  return { stream, text, progress: loadState.progress, status: loadState.status };
}

export default useRAG;
