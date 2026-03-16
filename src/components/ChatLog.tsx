import { memo } from 'preact/compat';
import { ChatLogProps, ChatRole, Message } from "../types";

const ChatLog = memo(({conversation, isStreaming}: ChatLogProps) => {

    const buildClasses = (role: ChatRole) => {
        if (role === ChatRole.User) {
            return 'mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg ml-auto max-w-[85%]';
        }
        return 'mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg mr-auto max-w-[85%]';
    }

    const buildNameClasses = (role: ChatRole) => {
        if (role === ChatRole.User) {
            return 'text-sm text-[var(--color-accent-green)] mb-2 font-semibold';
        }
        return 'text-sm text-[var(--color-accent-purple)] mb-2 font-semibold';
    }

    return (
        <div aria-live="polite" aria-busy={isStreaming}>
            {
                conversation.map((message: Message, index: number) => {
                    return (
                        <div class={buildClasses(message.role)} key={index}>
                            <div class={buildNameClasses(message.role)}>
                                {message.role === ChatRole.User ? 'You' : 'Assistant'}
                            </div>
                            <div class="text-theme whitespace-pre-wrap">
                                {message.content}
                            </div>
                        </div>
                    )
                })
            }
            {
                isStreaming && (
                    <div class="mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg mr-auto max-w-[85%]" role="status">
                        <div class="text-sm text-[var(--color-accent-purple)] mb-2 font-semibold">
                            Assistant
                        </div>
                        <div class="flex items-center gap-2 text-theme/70">
                            Thinking
                            <span class="animate-pulse">.</span>
                            <span class="animate-pulse" style={{ animationDelay: '150ms' }}>.</span>
                            <span class="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                        </div>
                    </div>
                )
            }
        </div>
    )
});

export default ChatLog;