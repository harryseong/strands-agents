import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Fade,
  Chip,
} from '@mui/material';
import { Send, Bot, User, Zap } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatService } from '../services/chatService';
import { Message } from '../types/chat';
import '../styles/ChatInterface.scss';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your RAG AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const aiMessageId = (Date.now() + 1).toString();
      let fullResponse = '';

      await chatService.sendMessage(
        content,
        (chunk: string) => {
          fullResponse += chunk;
          setCurrentStreamingMessage(fullResponse);
        },
        abortControllerRef.current.signal
      );

      // Add the complete AI message
      const aiMessage: Message = {
        id: aiMessageId,
        content: fullResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentStreamingMessage('');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error sending message:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          isError: true,
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setCurrentStreamingMessage('');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Container maxWidth="lg" className="chat-container">
      <Fade in timeout={1000}>
        <Paper elevation={0} className="chat-paper">
          <Box className="chat-header">
            <Box className="header-content">
              <Box className="logo-section">
                <IconButton className="logo-button">
                  <Bot className="logo-icon" />
                </IconButton>
                <Typography variant="h5" className="chat-title">
                  RAG AI Assistant
                </Typography>
              </Box>
              <Chip
                icon={<Zap size={16} />}
                label="Powered by Strands"
                className="status-chip"
                variant="outlined"
              />
            </Box>
          </Box>

          <Box className="chat-content">
            <MessageList
              messages={messages}
              currentStreamingMessage={currentStreamingMessage}
              isStreaming={isStreaming}
            />
            <div ref={messagesEndRef} />
          </Box>

          <Box className="chat-input-container">
            <MessageInput
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopStreaming={handleStopStreaming}
            />
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ChatInterface;