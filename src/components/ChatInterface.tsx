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
//                 Its inks follow Eliot's semantics — yellow (the YELLOW ink)
//                 while the model still has to load ("Model Not
//                 Loaded." / the load progress %), teal-green (the CYAN ink)
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
const PAPER_ELEVATED = '#F9FAF4';     // var(--glaphic-neutral-paper-elevated) — also the site's --panel-fill
const CYAN = '#14F1C8';
const YELLOW = '#FFE873';

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
    status === RAGStatus.Ready ? {bg: CYAN, fg: INK, msg: 'Model Ready.'} :
    status === RAGStatus.Error ? {bg: RED, fg: PAPER_ELEVATED, msg: 'Model Failed to Load.'} :
    status === RAGStatus.Loading ? {bg: YELLOW, fg: INK, msg: `Loading ${progress}%`} :
    {bg: YELLOW, fg: INK, msg: 'Model Not Loaded.'};

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
      class={`chat__stem ${hasMessages ? 'chat__stem--card' : ''}`}
      onClick={enterChat}
      onFocusCapture={enterChat}
    >

      {/* the chat card — in only once the user has sent */}
      {hasMessages && (
        <div class="chat__card" ref={chatContainerRef}>
          <ChatLog isStreaming={isStreaming} conversation={conversation} />
        </div>
      )}

      {/* the compose block: the input, with the status tab and the
          disclaimer hanging under it */}
      <div class="chat__compose">
        <form class="chat__form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div
            ref={inputRef}
            contentEditable={true}
            role="textbox"
            aria-label="Ask about Elie"
            class="chat__field"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Ask About Elie"
          />
          <button type="submit" disabled={isProcessing} class="chat__send" aria-label="Submit">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8H15M10 3L15 8L10 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </form>

        {/* the model-status tab — in only once the user has entered the
            chat (nothing shows before that); then the hook's state
            machine drives it ("Model Not Loaded." on the yellow plate) */}
        {enteredChat && (
          <div class="chat__tab" style={{ background: tabPlate.bg }}>
            <span style={{ color: tabPlate.fg }}>{tabPlate.msg}</span>
          </div>
        )}

        {/* the note under the tab: the yellow download warning before
            the first send, the violet small-model note once the chat
            has begun */}
        {hasMessages ? (
          <p class="chat__note chat__note--disclaimer">
            This is a very small model and therefore has all of the associated problems. For accurate information about me, please consult <a href="#/resume">my resume.</a>
          </p>
        ) : (
          <p class="chat__note chat__note--warn" role="alert">
            Submitting this form will download a ~6mb model to your browser.
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatInterface;