const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  holes: [{
    number: Number,
    par: Number,
    handicap: Number,
    distance: Number
  }],
  totalPar: {
    type: Number,
    required: true
  },
  totalDistance: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  slope: {
    type: Number,
    required: true
  },
  image: String,
  description: String
});

module.exports = mongoose.model('Course', courseSchema); 