import * as webllm from "@mlc-ai/web-llm";
import {useState, useCallback, useRef} from 'preact/hooks'
import { RAGResult, RAGStatus } from "../types";
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


const useRAG = (): RAGResult => {
    const engine = useRef<webllm.MLCEngineInterface | null>(null);
    const loading = useRef(false);

    const [status, setStatus] = useState<RAGStatus>(RAGStatus.Idle);
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState('');

    const ensureReady = useCallback(async () => {
        if (engine.current || loading.current) return;

        loading.current = true;
        setStatus(RAGStatus.Loading);

        try {
            engine.current = await webllm.CreateMLCEngine(MODEL_ID, {
              initProgressCallback: (p) => {
                setProgress(Math.round((p.progress || 0) * 100));
              },
            });
            setStatus(RAGStatus.Ready);
          } catch (e) {
            setStatus(RAGStatus.Error);
            loading.current = false;
            throw e;
          }
    }, []);

    const stream = useCallback(async function* (messages: any[], opts: any = {}) {
        await ensureReady();
        if (!engine.current) return;

        // Inject system prompt with resume context
        const messagesWithContext = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ];

        // @ts-ignore - web-llm types
        const response = await engine.current.chat.completions.create({
          messages: messagesWithContext,
          stream: true,
          max_tokens: 500,
          temperature: 0.3,
          ...opts,
        });
        // @ts-ignore - web-llm types
        for await (const chunk of response) {
          yield chunk.choices[0]?.delta?.content || '';
        }
      }, [ensureReady]);

      return {stream, text, progress, status}
}

export default useRAG;
