export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isError?: boolean;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamingMessage: string;
}