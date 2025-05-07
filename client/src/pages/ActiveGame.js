import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const ActiveGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentHole, setCurrentHole] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [score, setScore] = useState('');

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

  const handleScoreUpdate = async (playerId, holeNumber, newScore) => {
    try {
      await axios.put(`http://localhost:5000/api/games/${gameId}/score`, {
        playerId,
        holeNumber,
        score: newScore,
      });
      fetchGame();
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleOpenDialog = (player) => {
    setSelectedPlayer(player);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlayer(null);
    setScore('');
  };

  const handleSubmitScore = () => {
    if (selectedPlayer && score) {
      handleScoreUpdate(selectedPlayer._id, currentHole, parseInt(score));
      handleCloseDialog();
    }
  };

  if (!game) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">
            {game.type} - {game.course.name}
          </Typography>
          <Typography variant="h6">
            Hole {currentHole}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                {Array.from({ length: 18 }, (_, i) => (
                  <TableCell key={i + 1} align="center">
                    {i + 1}
                  </TableCell>
                ))}
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {game.players.map((player) => (
                <TableRow key={player._id}>
                  <TableCell>{player.name}</TableCell>
                  {Array.from({ length: 18 }, (_, i) => {
                    const holeScore = player.scores[i] || '-';
                    return (
                      <TableCell
                        key={i + 1}
                        align="center"
                        sx={{
                          backgroundColor:
                            i + 1 === currentHole ? 'action.hover' : 'inherit',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {holeScore}
                          {i + 1 === currentHole && (
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(player)}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    {player.scores.reduce((a, b) => a + (b || 0), 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            onClick={() => setCurrentHole(Math.max(1, currentHole - 1))}
            disabled={currentHole === 1}
          >
            Previous Hole
          </Button>
          <Button
            variant="contained"
            onClick={() => setCurrentHole(Math.min(18, currentHole + 1))}
            disabled={currentHole === 18}
          >
            Next Hole
          </Button>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Score for {selectedPlayer?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Score"
            type="number"
            fullWidth
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitScore} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActiveGame; 