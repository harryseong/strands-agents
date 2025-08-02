import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Bot } from 'lucide-react';
import '../styles/StreamingIndicator.scss';

const StreamingIndicator: React.FC = () => {
  return (
    <Box className="streaming-indicator">
      <Avatar className="streaming-avatar">
        <Bot size={20} />
      </Avatar>
      <Box className="streaming-dots">
        <Typography variant="body2" className="streaming-text">
          AI is thinking
        </Typography>
        <Box className="dots-container">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </Box>
      </Box>
    </Box>
  );
};

export default StreamingIndicator;