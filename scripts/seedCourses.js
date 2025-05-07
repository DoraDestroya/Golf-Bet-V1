const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const courses = [
  {
    name: 'Augusta National Golf Club',
    location: {
      city: 'Augusta',
      state: 'Georgia',
      country: 'USA'
    },
    holes: Array(18).fill().map((_, i) => ({
      number: i + 1,
      par: [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4][i],
      handicap: i + 1,
      distance: [445, 575, 350, 240, 495, 180, 450, 570, 460, 495, 505, 155, 510, 440, 530, 170, 440, 465][i]
    })),
    totalPar: 72,
    totalDistance: 7475,
    rating: 78.1,
    slope: 137,
    description: 'Home of the Masters Tournament, Augusta National is one of the most prestigious golf courses in the world.',
    image: 'https://example.com/augusta.jpg'
  },
  {
    name: 'Pebble Beach Golf Links',
    location: {
      city: 'Pebble Beach',
      state: 'California',
      country: 'USA'
    },
    holes: Array(18).fill().map((_, i) => ({
      number: i + 1,
      par: [4, 4, 4, 4, 3, 5, 3, 4, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5][i],
      handicap: i + 1,
      distance: [380, 516, 404, 331, 195, 523, 106, 428, 526, 495, 390, 202, 445, 580, 397, 403, 208, 543][i]
    })),
    totalPar: 72,
    totalDistance: 7075,
    rating: 75.5,
    slope: 145,
    description: 'Stunning coastal course with breathtaking views of the Pacific Ocean.',
    image: 'https://example.com/pebble-beach.jpg'
  },
  // Add more courses here...
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-bet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing courses
    await Course.deleteMany({});

    // Insert new courses
    await Course.insertMany(courses);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 