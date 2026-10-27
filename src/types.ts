import type { ChatCompletionMessageParam, ChatCompletionRequestBase } from "@mlc-ai/web-llm";

export enum ChatRole {
    Assistant = 'assistant',
    User = 'user',
};

export interface Message {
    content: string,
    role: ChatRole
};

export interface ChatLogProps {
    conversation: Message[],
    isStreaming: boolean,
};

export enum RAGStatus {
    Loading,
    Ready,
    Idle,
    Error
};

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