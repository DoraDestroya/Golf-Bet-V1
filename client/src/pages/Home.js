import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import TimerIcon from '@mui/icons-material/Timer';

const gameTypes = [
  {
    title: 'Wolf',
    description: 'A strategic game where players take turns being the "wolf" and can choose partners for each hole.',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Skins',
    description: 'Each hole is worth a skin, and players compete for the lowest score on each hole.',
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Scramble',
    description: 'Team format where players choose the best shot and all play from that position.',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Stroke Play',
    description: 'Traditional scoring where the lowest total score wins.',
    icon: <TimerIcon sx={{ fontSize: 40 }} />,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <SportsGolfIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Golf Bet
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Select a game type to get started
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {gameTypes.map((game) => (
          <Grid item xs={12} sm={6} md={3} key={game.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 2, color: 'primary.main' }}>
                  {game.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {game.title}
                </Typography>
                <Typography color="text.secondary">
                  {game.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/game-setup', { state: { gameType: game.title } })}
                >
                  Play {game.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 