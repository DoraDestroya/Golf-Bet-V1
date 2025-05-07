import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import axios from 'axios';

const CourseSelection = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !selectedState || course.location.state === selectedState;
    return matchesSearch && matchesState;
  });

  const states = [...new Set(courses.map(course => course.location.state))].sort();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Golf Courses
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Filter by State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
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
              <CardMedia
                component="img"
                height="200"
                image={course.image || 'https://via.placeholder.com/300x200?text=Golf+Course'}
                alt={course.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.location.city}, {course.location.state}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={course.rating} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({course.rating})
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Par ${course.totalPar}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${course.totalDistance} yards`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Slope: ${course.slope}`}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {course.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseSelection; 