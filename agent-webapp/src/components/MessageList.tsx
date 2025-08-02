import React from 'react';
import { Box, Fade, Slide } from '@mui/material';
import MessageBubble from './MessageBubble';
import StreamingIndicator from './StreamingIndicator';
import { Message } from '../types/chat';
import '../styles/MessageList.scss';

interface MessageListProps {
  messages: Message[];
  currentStreamingMessage: string;
  isStreaming: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentStreamingMessage,
  isStreaming,
}) => {
  return (
    <Box className="message-list">
      {messages.map((message, index) => (
        <Slide
          key={message.id}
          direction="up"
          in={true}
          timeout={300}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div>
            <MessageBubble message={message} />
          </div>
        </Slide>
      ))}
      
      {isStreaming && currentStreamingMessage && (
        <Fade in timeout={300}>
          <div>
            <MessageBubble
              message={{
                id: 'streaming',
                content: currentStreamingMessage,
                sender: 'ai',
                timestamp: new Date(),
                isStreaming: true,
              }}
            />
          </div>
        </Fade>
      )}
      
      {isStreaming && !currentStreamingMessage && (
        <Fade in timeout={300}>
          <div>
            <StreamingIndicator />
          </div>
        </Fade>
      )}
    </Box>
  );
};

export default MessageList;