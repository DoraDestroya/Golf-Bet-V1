import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import axios from 'axios';

const GameSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameType, setGameType] = useState(location.state?.gameType || '');
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleAddPlayer = () => {
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (playerToRemove) => {
    setPlayers(players.filter(player => player !== playerToRemove));
  };

  const handleStartGame = async () => {
    if (!gameType || !course || players.length < 2) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const gameData = {
        type: gameType,
        course: course._id,
        players: players.map(player => ({ name: player })),
        betAmount: parseFloat(betAmount) || 0,
      };

      const response = await axios.post('http://localhost:5000/api/games', gameData);
      navigate(`/active-game/${response.data._id}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Game Setup
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Game Type</InputLabel>
              <Select
                value={gameType}
                label="Game Type"
                onChange={(e) => setGameType(e.target.value)}
              >
                <MenuItem value="wolf">Wolf</MenuItem>
                <MenuItem value="skins">Skins</MenuItem>
                <MenuItem value="scramble">Scramble</MenuItem>
                <MenuItem value="stroke">Stroke Play</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => option.name}
              value={course}
              onChange={(event, newValue) => setCourse(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Course" required />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Players
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Player"
                  value={newPlayer}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                />
                <Button
                  variant="contained"
                  onClick={handleAddPlayer}
                  disabled={!newPlayer}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {players.map((player) => (
                  <Chip
                    key={player}
                    label={player}
                    onDelete={() => handleRemovePlayer(player)}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bet Amount ($)"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleStartGame}
              disabled={loading || !gameType || !course || players.length < 2}
            >
              {loading ? 'Starting Game...' : 'Start Game'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default GameSetup; 