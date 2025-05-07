import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameSetup from './pages/GameSetup';
import ActiveGame from './pages/ActiveGame';
import PlayerStats from './pages/PlayerStats';
import CourseSelection from './pages/CourseSelection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Golf green
    },
    secondary: {
      main: '#f57c00', // Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game-setup" element={<GameSetup />} />
          <Route path="/active-game/:gameId" element={<ActiveGame />} />
          <Route path="/player-stats" element={<PlayerStats />} />
          <Route path="/courses" element={<CourseSelection />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 