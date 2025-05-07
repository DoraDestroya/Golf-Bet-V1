import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerHistory, setPlayerHistory] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      fetchPlayerHistory(selectedPlayer._id);
    }
  }, [selectedPlayer]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setPlayers(response.data);
      if (response.data.length > 0) {
        setSelectedPlayer(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchPlayerHistory = async (playerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${playerId}/history`);
      setPlayerHistory(response.data);
    } catch (error) {
      console.error('Error fetching player history:', error);
    }
  };

  const calculateAverageScore = (scores) => {
    if (!scores.length) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const calculateWinRate = (wins, total) => {
    if (!total) return 0;
    return (wins / total) * 100;
  };

  if (!selectedPlayer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Player Statistics
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedPlayer.name}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Handicap: {selectedPlayer.handicap}
                </Typography>
                <Typography variant="body1">
                  Rounds Played: {selectedPlayer.stats.roundsPlayed}
                </Typography>
                <Typography variant="body1">
                  Average Score: {selectedPlayer.stats.averageScore.toFixed(1)}
                </Typography>
                <Typography variant="body1">
                  Best Score: {selectedPlayer.stats.bestScore}
                </Typography>
                <Typography variant="body1">
                  Win Rate: {calculateWinRate(selectedPlayer.stats.wins, selectedPlayer.stats.roundsPlayed).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Score History
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={playerHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2e7d32"
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Games
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Game Type</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerHistory.map((game) => (
                    <TableRow key={game._id}>
                      <TableCell>{new Date(game.date).toLocaleDateString()}</TableCell>
                      <TableCell>{game.course.name}</TableCell>
                      <TableCell>{game.type}</TableCell>
                      <TableCell>{game.score}</TableCell>
                      <TableCell>{game.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlayerStats; 