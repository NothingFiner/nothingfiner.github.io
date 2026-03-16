import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import useRAG from '../hooks/useRAG';
import ChatLog from './ChatLog';
import StatusBar from './StatusBar';
import { RAGStatus, ChatRole, Message } from '../types';

const ChatInterface = () => {

  const [, navigate] = useLocation();
  const {stream, status, progress, text} = useRAG();

  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isStreaming = useMemo(() => status === RAGStatus.Loading, [status]);
  const isLoading = useMemo(() => status === RAGStatus.Loading, [status]);
  const isReady = useMemo(() => status === RAGStatus.Ready, [status]);
  const isError = useMemo(() => status === RAGStatus.Error, [status]);

  const handleSubmit = async () => {
    const newMessage = inputValue.trim();
    if (!newMessage || isProcessing) return;

    setIsExpanded(true);
    setIsProcessing(true);
    setInputValue('');
    if (inputRef.current) inputRef.current.textContent = '';

    // Add user message to conversation
    const userMessage: Message = {role: ChatRole.User, content: newMessage};
    setConversation((prev) => [...prev, userMessage]);

    // Add placeholder for assistant message
    setConversation((prev) => [...prev, {role: ChatRole.Assistant, content: ''}]);

    try {
      // Build messages array including the new user message
      const messages = [...conversation, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

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

  const handleChatEdit = () => {
    setIsEditing(true);
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
  useEffect(() => {
    if (chatContainerRef.current && conversation.length > 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      });
    }
  }, [conversation]);

    return (
        <div class="w-full max-w-6xl mx-auto">
          {/* Chat Log Pane - slides out when expanded */}
          <div
            class={`rounded-2xl glass overflow-hidden flex flex-col transition-all duration-500 ease-out ${
              isExpanded
                ? 'min-h-[400px] mb-4 max-h-[60vh] opacity-100 translate-y-0'
                : 'min-h-0 max-h-0 opacity-0 -translate-y-4'
            }`}
          >
            <div ref={chatContainerRef} class="flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin h-full">
              {conversation.length === 0 ? (
                <div class="h-full flex items-center justify-center text-theme/50">
                  <p class="text-lg">Start a conversation...</p>
                </div>
              ) : (
                <ChatLog isStreaming={isStreaming} conversation={conversation} />
              )}
            </div>
          </div>

          {/* Status Bar - slides out from behind input */}
          <div
            class={`transition-all duration-500 -mb-4 ease-out overflow-hidden ${
              isExpanded ? 'max-h-32 opacity-100 translate-y-0' : 'max-h-0 opacity-0 mb-0 translate-y-4'
            }`}
          >
            <StatusBar status={status} progress={progress} />
          </div>

          {/* Input Pane */}
          <form class="rounded-2xl glass overflow-hidden relative" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div
              ref={inputRef}
              contentEditable={true}
              role="textbox"
              class={`w-full px-6 py-4 bg-transparent text-theme placeholder-[var(--color-fg)]/50 focus:outline-none text-lg font-body before:empty:text-gray-400 before:empty:[content:attr(data-placeholder)]`}
              onFocus={handleChatEdit}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="ask about Elie...."
            />
            <button
              type="submit"
              disabled={isProcessing || isLoading}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl glass transition-transform hover:scale-105 transition-colors text-theme disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Submit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>

          {/* Model Download Notice */}
          <div class="text-center text-xs text-theme/40 mt-3 max-w-2xl mx-auto">
            Using the chatbot will download a quantized model onto your device to run on your GPU. The initial download will be north of half a GB.
          </div>
        </div>
    )
}

export default ChatInterface;
