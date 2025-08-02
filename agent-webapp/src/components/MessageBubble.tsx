import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { Bot, User, AlertCircle } from 'lucide-react';
import { Message } from '../types/chat';
import MarkdownRenderer from './MarkdownRenderer';
import '../styles/MessageBubble.scss';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  return (
    <Box className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <Box className="message-content">
        {isAI && (
          <Avatar className="message-avatar ai-avatar">
            <Bot size={20} />
          </Avatar>
        )}
        
        <Box className="message-text-container">
          <Box className={`message-text ${isUser ? 'user-text' : 'ai-text'}`}>
            {isUser ? (
              <Typography variant="body1" component="div">
                {message.content}
              </Typography>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            
            {message.isError && (
              <Chip
                icon={<AlertCircle size={14} />}
                label="Error"
                color="error"
                size="small"
                className="error-chip"
              />
            )}
            
            {message.isStreaming && (
              <Box className="streaming-cursor" />
            )}
          </Box>
          
          <Typography variant="caption" className="message-timestamp">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
        
        {isUser && (
          <Avatar className="message-avatar user-avatar">
            <User size={20} />
          </Avatar>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;