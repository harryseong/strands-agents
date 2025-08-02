import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatInterface from './components/ChatInterface';
import './styles/App.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff', // Neon cyan
      light: '#66f7ff',
      dark: '#00c4cc',
    },
    secondary: {
      main: '#ff0040', // Changed from magenta to red
      light: '#ff4066',
      dark: '#cc0033',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          minHeight: '100vh',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app">
        <ChatInterface />
      </div>
    </ThemeProvider>
  );
}

export default App;