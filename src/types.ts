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

export interface RAGResult {
    stream: (messages: any[], opts?: any) => AsyncGenerator<string>;
    text: string;
    progress: number;
    status: RAGStatus;
}