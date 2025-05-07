const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find()
      .populate('course')
      .populate('players.player');
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('course')
      .populate('players.player');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new game
router.post('/', async (req, res) => {
  try {
    const { type, course, players, betAmount } = req.body;

    // Create player entries
    const playerEntries = await Promise.all(
      players.map(async (player) => {
        let user = await User.findOne({ name: player.name });
        if (!user) {
          user = new User({
            name: player.name,
            email: `${player.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            password: 'defaultpassword',
          });
          await user.save();
        }
        return {
          player: user._id,
          scores: Array(18).fill(null),
          totalScore: 0,
          betAmount,
          winnings: 0,
        };
      })
    );

    const game = new Game({
      type,
      course,
      players: playerEntries,
      betAmount,
    });

    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update game score
router.put('/:id/score', async (req, res) => {
  try {
    const { playerId, holeNumber, score } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const playerIndex = game.players.findIndex(
      (p) => p.player.toString() === playerId
    );

    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found in game' });
    }

    // Update score for the specific hole
    game.players[playerIndex].scores[holeNumber - 1] = score;

    // Recalculate total score
    game.players[playerIndex].totalScore = game.players[playerIndex].scores.reduce(
      (sum, score) => sum + (score || 0),
      0
    );

    // Update game results based on game type
    if (game.type === 'stroke') {
      const sortedPlayers = [...game.players].sort(
        (a, b) => a.totalScore - b.totalScore
      );
      const winner = sortedPlayers[0];
      const pot = game.players.length * game.betAmount;

      // Update winnings
      game.players.forEach((player) => {
        if (player.player.toString() === winner.player.toString()) {
          player.winnings = pot;
        } else {
          player.winnings = -game.betAmount;
        }
      });

      game.results = {
        winners: [winner.player],
        totalPot: pot,
        payouts: game.players.map((p) => ({
          player: p.player,
          amount: p.winnings,
        })),
      };
    }

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete game
router.put('/:id/complete', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.status = 'completed';
    game.endDate = new Date();

    // Update player stats
    for (const player of game.players) {
      const user = await User.findById(player.player);
      if (user) {
        user.stats.roundsPlayed += 1;
        user.stats.averageScore =
          (user.stats.averageScore * (user.stats.roundsPlayed - 1) +
            player.totalScore) /
          user.stats.roundsPlayed;
        user.stats.bestScore = Math.min(
          user.stats.bestScore || Infinity,
          player.totalScore
        );
        if (player.winnings > 0) {
          user.stats.wins += 1;
        } else {
          user.stats.losses += 1;
        }
        await user.save();
      }
    }

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 