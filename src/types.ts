import type { ChatCompletionMessageParam, ChatCompletionRequestBase } from "@mlc-ai/web-llm";

// const maps + unions replace the enums (typescript.md) — the member
// values are the web-llm wire roles, byte-identical strings
export const ChatRole = {
    Assistant: 'assistant',
    User: 'user',
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

export interface Message {
    content: string,
    role: ChatRole
};

export interface ChatLogProps {
    conversation: Message[],
    isStreaming: boolean,
};

// the load's state machine as a const map + union (typescript.md) —
// the numbers carry the enum's original values (compared in-app only)
export const RAGStatus = {
    Loading: 0,
    Ready: 1,
    Idle: 2,
    Error: 3,
} as const;

export type RAGStatus = (typeof RAGStatus)[keyof typeof RAGStatus];

/** the engine call's sampling overrides — the hook composes the
 *  messages and forces stream:true itself, so neither may ride
 *  through opts (the call would stop streaming, or replace the
 *  resume-context system message) */
export type StreamOptions = Omit<Partial<ChatCompletionRequestBase>, 'messages' | 'stream'>;

export interface RAGResult {
    stream: (messages: ChatCompletionMessageParam[], opts?: StreamOptions) => AsyncGenerator<string>;
    text: string;
    progress: number;
    status: RAGStatus;
}