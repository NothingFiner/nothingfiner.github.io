// New-design chat composition — the "Resume RAG" input pane and, once
// the user sends, the chat card (design/ chat-open + chat-submitted
// mocks, settled to Eliot's one-pose call). The model plumbing is
// untouched: the RAG hook stays, the send flow stays (Enter + the arrow
// button) — the redesign only RESURFACES the states the hook already
// exposes:
//
//   the compose   the paper field + the outlined arrow button (the
//                 button recipe follows the glaphic outline button's
//                 reactive states: transparent fill, on hover the
//                 paper-deep pours in under the crisp crimson rim, on
//                 press the button steps to its offset, disabled greys
//                 to the cool ramp — ink holds throughout).
//   status tab    the mock's small mono readout hanging under the
//                 input's left edge, in only once the user has entered
//                 the chat (nothing model-status shows before that).
//                 Its inks follow Eliot's semantics — yellow #FFE873
//                 while the model still has to load ("Model Not
//                 Loaded." / the load progress %), teal-green #14F1C8
//                 once the engine reports ready, crimson on a load
//                 error.
//   disclaimer    the note under the input, state-driven: before the
//                 first send it is the YELLOW warning plate (the same
//                 warning ink the status tab uses) naming the download
//                 cost; once the chat has begun it swaps to the violet
//                 note ("resume" jumps to the site's resume page).
//   the card      on send the stem re-anchors (the card + its air
//                 claim the drop the submitted mock shows) and the
//                 light panel takes the conversation — angular teal
//                 user plates right, angular crimson assistant plates
//                 left (ChatLog owns the plates).
import { useState, useMemo, useRef, useLayoutEffect } from 'preact/hooks';
import useRAG from '../hooks/useRAG';
import ChatLog from './ChatLog';
import { RAGStatus, ChatRole, Message } from '../types';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

const INK = '#0D0221';
const RED = '#A6022A';
const PAPER = '#F9FAF4';

// the arrow button's reactive recipe — the glaphic outline button's
// states with the brand-dark (crimson) ink: transparent fill at rest,
// paper-deep pouring in on hover (the rim's ink holds), the press
// stepping to the plate's offset, disabled greying to the cool ramp
const OUTLINE = {
  surface: 'transparent',
  text: RED,
  border: RED,
  'hover-surface': '#E9EDE0', // var(--glaphic-neutral-paper-deep)
  'disabled-surface': '#E9E7EF', // var(--glaphic-neutral-grey-cool-100)
  'disabled-text': '#BAB6C7', // var(--glaphic-neutral-grey-cool-300)
  'disabled-border': '#BAB6C7',
};

const ChatInterface = () => {

  const {stream, status, progress} = useRAG();

  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isStreaming = useMemo(() => status === RAGStatus.Loading, [status]);

  // the submitted pose: the chat card is in (the mock swaps it in on send)
  const hasMessages = conversation.length > 0;

  // the user has entered the chat: their first click or focus inside the
  // chat window (the compose or the card). The model-status tab waits for
  // this — before it, no status UI shows at all.
  const [enteredChat, setEnteredChat] = useState(false);
  const enterChat = () => setEnteredChat(true);

  // the tab's plate + readout per the hook's state machine
  const tabPlate =
    status === RAGStatus.Ready ? {bg: '#14F1C8', fg: INK, msg: 'Model Ready.'} :
    status === RAGStatus.Error ? {bg: RED, fg: PAPER, msg: 'Model Failed to Load.'} :
    status === RAGStatus.Loading ? {bg: '#FFE873', fg: INK, msg: `Loading ${progress}%`} :
    {bg: '#FFE873', fg: INK, msg: 'Model Not Loaded.'};

  const handleSubmit = async () => {
    const newMessage = inputValue.trim();
    if (!newMessage || isProcessing) return;

    setIsProcessing(true);
    setInputValue('');
    if (inputRef.current) inputRef.current.textContent = '';

    // Add user message to conversation
    const userMessage: Message = {role: ChatRole.User, content: newMessage};
    setConversation((prev) => [...prev, userMessage]);

    // Add placeholder for assistant message
    setConversation((prev) => [...prev, {role: ChatRole.Assistant, content: ''}]);

    try {
      // Build messages array including the new user message — the
      // engine's param union is discriminated by role, so each message
      // is rebuilt with its literal role (no casts, typescript.md)
      const messages: ChatCompletionMessageParam[] = [...conversation, userMessage].map(
        (m): ChatCompletionMessageParam =>
          m.role === ChatRole.User
            ? { role: 'user', content: m.content }
            : { role: 'assistant', content: m.content }
      );

      let assistantResponse = '';
      for await (const chunk of stream(messages)) {
        assistantResponse += chunk;
        // Update the last message (assistant) with streaming content
        setConversation((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {role: ChatRole.Assistant, content: assistantResponse};
          return updated;
        });
      }

    } catch (err) {
      console.error('Streaming failed:', err);
      // Remove the empty assistant message on error
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLDivElement;
    setInputValue(target.textContent || '');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isProcessing) {
        handleSubmit();
      }
    }
  };

  // Auto-scroll to bottom when conversation changes
  useLayoutEffect(() => {
    if (chatContainerRef.current && conversation.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div
      class={`chat-stem ${hasMessages ? 'chat-stem-card' : ''}`}
      onClick={enterChat}
      onFocusCapture={enterChat}
    >
      <style>{`
        /* ── the stem: the centered hold the card + compose live in ─
           the compose block never moves on selection (the pose's
           differences hang off the input, not where it stands); only
           the card's arrival re-anchors the stem (it carries a card +
           its air, which claims the drop the submitted mock shows) */
        .chat-stem {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 27vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
          transition: bottom 0.5s cubic-bezier(0.25, 1, 0.4, 1);
        }
        .chat-stem-card { bottom: 20.8vh; }

        /* ── the chat card (the submitted mock's big light panel) ── */
        .chat-card {
          width: 546px;
          max-width: 88vw;
          height: 364px;
          background: #E9EDE0;
          border: 1px solid #D5D2DE;
          /* the mock's card-to-tab air (the tab rides under the input
             at its own absolute height) */
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .chat-card::-webkit-scrollbar { width: 6px; }
        .chat-card::-webkit-scrollbar-thumb { background: #9D99AB; }

        /* ── the compose block: input + status tab + disclaimer ──── */
        .chat-compose {
          position: relative;
          width: 546px;
          max-width: 88vw;
        }

        /* ── the input row: the mock's paper field + outlined arrow ─ */
        .chat-form {
          position: relative;
          display: flex;
          align-items: center;
          background: #F2F5EB;
          border: 1px solid #9D99AB;
          height: 55px;
        }
        .chat-field {
          flex: 1;
          padding: 0 20px;
          /* the field's mono type centers in the 55px row */
          line-height: 51px;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 14px;
          color: ${INK};
          white-space: nowrap;
          overflow-x: auto;
        }
        /* the mock's field carries only its 1px rim — the global
           :focus-visible ring stays on the rest of the site's controls,
           not the chat's caret row */
        .chat-field,
        .chat-field:focus,
        .chat-field:focus-visible {
          outline: none;
          caret-color: #686474;
        }
        .chat-field:empty::before {
          content: attr(data-placeholder);
          color: #686474;
        }

        /* the arrow button — the glaphic outline recipe on the
           brand-dark ink (see OUTLINE above): rim + arrow the same
           crimson, the fill transparent until hover pours paper-deep
           under it, press steps the plate, disabled greys out */
        .chat-send {
          position: absolute;
          right: 9px;
          top: 50%;
          translate: 0 -50%;
          width: 36px;
          height: 37px;
          border: 1px solid ${OUTLINE.border};
          border-radius: 2px;
          background: ${OUTLINE.surface};
          color: ${OUTLINE.text};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.18s ease, translate 0.1s ease, color 0.18s ease;
        }
        .chat-send:hover:not(:disabled) { background: ${OUTLINE['hover-surface']}; }
        .chat-send:active:not(:disabled) { translate: 1px calc(-50% + 1px); }
        .chat-send:disabled {
          background: ${OUTLINE['disabled-surface']};
          color: ${OUTLINE['disabled-text']};
          border-color: ${OUTLINE['disabled-border']};
          cursor: default;
        }

        /* ── the status tab: the small mono readout hanging under the
           input's left edge (the mock's plate, moved below the box) ─ */
        .chat-tab {
          position: absolute;
          top: 100%;
          left: 15px;
          height: 28px;
          min-width: 140px;
          background: #FFE873;
          overflow: hidden;
          white-space: nowrap;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 12px;
          line-height: 1;
          color: ${INK};
          padding: 0 10px;
          display: flex;
          align-items: center;
          transition: background 0.3s ease-out;
        }

        /* ── the note under the tab — state-driven: the yellow warning
           plate before the first send (the status tab's warning inks,
           same plate geometry as the violet note), the violet disclaimer
           once the chat has begun ── */
        .chat-note {
          position: absolute;
          top: calc(100% + 50px);
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          max-width: 88vw;
          font-family: var(--f-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          line-height: 1.35;
          padding: 11px 18px;
        }
        .chat-note-warn {
          background: #FFE873;
          border: 1px solid ${INK};
          color: ${INK};
        }
        .chat-note-disclaimer {
          background: #EFE8FF;
          border: 1px solid #5A1FCC;
          color: #5A1FCC;
        }
        .chat-note a { color: inherit; }

        @media (max-width: 899px) {
          .chat-stem, .chat-stem-card {
            position: static;
            margin-top: 14vh;
            padding: 0 6vw;
          }
          .chat-card { width: 100%; height: 46vh; margin-bottom: 24px; }
          /* mobile flips the tab's hang: it sits ABOVE the input (the
             note is in the flow right below, so hanging down would drop
             the tab onto it) — same plate, same inks, mirrored anchor */
          .chat-tab {
            left: 0;
            min-width: 140px;
            top: auto;
            bottom: calc(100% + 9px);
          }
          .chat-note { position: static; transform: none; margin-top: 44px; }
          .chat-send { width: 44px; height: 44px; }
        }
      `}</style>

      {/* the chat card — in only once the user has sent */}
      {hasMessages && (
        <div class="chat-card" ref={chatContainerRef}>
          <ChatLog isStreaming={isStreaming} conversation={conversation} />
        </div>
      )}

      {/* the compose block: the input, with the status tab and the
          disclaimer hanging under it */}
      <div class="chat-compose">
        <form class="chat-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div
            ref={inputRef}
            contentEditable={true}
            role="textbox"
            aria-label="Ask about Elie"
            class="chat-field"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Ask About Elie"
          />
          <button type="submit" disabled={isProcessing} class="chat-send" aria-label="Submit">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8H15M10 3L15 8L10 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </form>

        {/* the model-status tab — in only once the user has entered the
            chat (nothing shows before that); then the hook's state
            machine drives it ("Model Not Loaded." on the yellow plate) */}
        {enteredChat && (
          <div class="chat-tab" style={{ background: tabPlate.bg }}>
            <span style={{ color: tabPlate.fg }}>{tabPlate.msg}</span>
          </div>
        )}

        {/* the note under the tab: the yellow download warning before
            the first send, the violet small-model note once the chat
            has begun */}
        {hasMessages ? (
          <p class="chat-note chat-note-disclaimer">
            This is a very small model and therefore has all of the associated problems. For accurate information about me, please consult <a href="#/resume">my resume.</a>
          </p>
        ) : (
          <p class="chat-note chat-note-warn" role="alert">
            Submitting this form will download a ~6mb model to your browser.
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatInterface;