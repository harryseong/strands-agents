import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Chip,
} from '@mui/material';
import { Send, Square } from 'lucide-react';
import '../styles/MessageInput.scss';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <Paper elevation={0} className="message-input-paper">
      <Box className="message-input-container">
        <form onSubmit={handleSubmit} className="message-form">
          <TextField
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Type your message..."
            multiline
            maxRows={4}
            disabled={isStreaming}
            className="message-input"
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <Box className="input-actions">
                  {isStreaming ? (
                    <Tooltip title="Stop generation">
                      <IconButton
                        onClick={onStopStreaming}
                        className="stop-button"
                        size="small"
                      >
                        <Square size={18} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Send message">
                      <IconButton
                        type="submit"
                        disabled={!inputValue.trim() || isStreaming}
                        className="send-button"
                        size="small"
                      >
                        <Send size={18} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              ),
            }}
          />
        </form>
        
        {isStreaming && (
          <Chip
            label="AI is thinking..."
            color="primary"
            size="small"
            className="streaming-chip"
          />
        )}
      </Box>
    </Paper>
  );
};

export default MessageInput;