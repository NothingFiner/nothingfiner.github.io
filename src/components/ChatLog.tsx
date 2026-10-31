// New-design chat plates — the submitted mock's angular bubbles inside
// the light chat card: USER turns right-aligned on the fluro teal plate
// (ink type), ASSISTANT turns left-aligned on the crimson plate (paper
// type). Both plates carry the mock's cut outer corners — the bevel pair
// (a ~19px diagonal notch top-left and bottom-right) — as one clip-path
// polygon, no mask/alpha tricks, so the notches stay crisp on resize.
// While the assistant thinks (its turn still empty, or the stream's first
// token not yet landed) the crimson plate holds the mock's "…" readout;
// the assistant's own lines type in mono.
import { memo } from 'preact/compat';
import { ChatLogProps, ChatRole, Message } from "../types";

const INK = '#0D0221';
const RED = '#A6022A';
const PAPER = '#F9FAF4';
const ECHO = '#14F1C8';

// the plates' cut — the mock's ~19px notch on the top-left and
// bottom-right corners of both plates
const CUT = 'polygon(19px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 19px) 100%, 0 100%, 0 20px)';

const ChatLog = memo(({conversation, isStreaming}: ChatLogProps) => {

    const buildPlate = (role: ChatRole) => {
        if (role === ChatRole.User) {
            return 'chat-log__plate chat-log__plate--user';
        }
        return 'chat-log__plate chat-log__plate--assistant';
    }

    return (
        <div class="chat-log" aria-live="polite" aria-busy={isStreaming}>
            <style>{`
                .chat-log__plate {
                    display: block;
                    width: fit-content;
                    max-width: 380px;
                    min-height: 68px;
                    padding: 24px;
                    margin: 0 0 38px;
                    background: ${INK};
                    color: ${INK};
                    clip-path: ${CUT};
                }
                /* user: right-aligned teal plate, ink body type */
                .chat-log__plate--user {
                    margin-left: auto;
                    background: ${ECHO};
                    color: ${INK};
                    font-family: var(--f-body, 'Inter', sans-serif);
                    font-size: 16px;
                    line-height: 20px;
                }
                /* assistant: left-aligned crimson plate, mono type */
                .chat-log__plate--assistant {
                    margin-right: auto;
                    background: ${RED};
                    color: ${PAPER};
                    font-family: var(--f-mono, 'IBM Plex Mono', monospace);
                    font-size: 13px;
                    line-height: 20px;
                    white-space: pre-wrap;
                }
                /* while thinking the mock holds the plate at its wide
                   pose (the dots readout — text arrives, the plate
                   rides the turn's own width again) */
                .chat-log__plate--assistant:has(.chat-log__dots) {
                    min-width: 358px;
                }
                .chat-log__dots {
                    letter-spacing: 0.2em;
                    font-weight: 500;
                }
                .chat-log__dots span { animation: chat-log-dot-blink 1.1s ease-in-out infinite; }
                .chat-log__dots span:nth-child(2) { animation-delay: 180ms; }
                .chat-log__dots span:nth-child(3) { animation-delay: 360ms; }
                @keyframes chat-log-dot-blink {
                    0%, 100% { opacity: 0.25; }
                    50% { opacity: 1; }
                }
            `}</style>
            {
                conversation.map((message: Message, index: number) => {
                    return (
                        <div class={buildPlate(message.role)} key={index}>
                            {message.role === ChatRole.Assistant && !message.content ? (
                                <span class="chat-log__dots" role="status">
                                    <span>.</span><span>.</span><span>.</span>
                                </span>
                            ) : (
                                message.content
                            )}
                        </div>
                    )
                })
            }
        </div>
    )
});

export default ChatLog;