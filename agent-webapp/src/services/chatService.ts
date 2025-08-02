import axios from 'axios';

export interface StreamingResponse {
  chunk: string;
  isComplete: boolean;
}

class ChatService {
  private baseURL = 'http://localhost:3001/api'; // Replace with your backend URL

  async sendMessage(
    message: string,
    onChunk: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    try {
      // For demo purposes, we'll simulate streaming with setTimeout
      // In production, replace this with actual SSE implementation
      await this.simulateStreaming(message, onChunk, abortSignal);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      console.error('Chat service error:', error);
      throw new Error('Failed to send message');
    }
  }

  // This is a simulation of SSE streaming for demo purposes
  private async simulateStreaming(
    message: string,
    onChunk: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    const responses = [
      "I understand your question about **",
      message.toLowerCase(),
      "**. Let me provide you with a comprehensive response.\n\n",
      "## Key Points\n\n",
      "Here are the main aspects to consider:\n\n",
      "- **First point**: Understanding the fundamentals is crucial\n",
      "- **Second point**: Implementation requires careful planning\n",
      "- **Third point**: Best practices should always be followed\n\n",
      "### Example Table\n\n",
      "| Feature | Description | Status |\n",
      "|---------|-------------|--------|\n",
      "| Markdown | Full support for markdown rendering | ✅ Complete |\n",
      "| Tables | GitHub-flavored markdown tables | ✅ Complete |\n",
      "| Links | External links open in new tabs | ✅ Complete |\n",
      "| Code | Inline `code` and code blocks | ✅ Complete |\n\n",
      "### Useful Resources\n\n",
      "For more information, you might want to check out:\n",
      "- [React Documentation](https://react.dev)\n",
      "- [Material-UI Guide](https://mui.com)\n",
      "- [Markdown Guide](https://www.markdownguide.org)\n\n",
      "> **Note**: All external links will open in a new tab for your convenience.\n\n",
      "```javascript\n",
      "// Example code block\n",
      "const example = {\n",
      "  markdown: true,\n",
      "  tables: true,\n",
      "  links: 'new-tab'\n",
      "};\n",
      "```\n\n",
      "Would you like me to elaborate on any of these points or explore a specific aspect in more detail?"
    ];

    for (let i = 0; i < responses.length; i++) {
      if (abortSignal?.aborted) {
        throw new Error('Request aborted');
      }

      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      onChunk(responses[i]);
    }
  }

  // For actual SSE implementation, use this method:
  async sendMessageWithSSE(
    message: string,
    onChunk: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ message }),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    try {
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed.content || '');
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const chatService = new ChatService();