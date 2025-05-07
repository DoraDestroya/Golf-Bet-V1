const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['wolf', 'skins', 'scramble', 'stroke'],
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scores: [Number],
    totalScore: Number,
    betAmount: Number,
    winnings: Number
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  gameSettings: {
    wolf: {
      rotation: [Number],
      currentWolf: Number
    },
    skins: {
      carryover: Boolean,
      minimumSkins: Number
    },
    scramble: {
      teams: [[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]]
    }
  },
  results: {
    winners: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    totalPot: Number,
    payouts: [{
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number
    }]
  }
});

module.exports = mongoose.model('Game', gameSchema); 