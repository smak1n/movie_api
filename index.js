const express = require('express');
const app = express();
const morgan = require('morgan');
const uuid = require('uuid');

// my top 10 sci-fy movies
let favoriteMovies = [
  {
    title: 'Inception',
    year: 2010,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Christopher Nolan'
  },
  {
    title: 'Source Code',
    year: 2011,
    genre: ['Action', 'Drama', 'Mistery'],
    director: 'Duncan Jones'
  },
  {
    title: 'Interstellar',
    year: 2014,
    genre: ['Drama', 'Adventure', 'Sci-Fi'],
    director: 'Christopher Nolan'
  },
  {
    title: 'Edge of Tomorrow',
    year: 2014,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Doug Liman'
  },
  {
    title: 'Jupiter Ascending',
    year: 2015,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: ['Lana Wachowski', 'Lilly Wachowski']
  },
  {
    title: 'Assassin\'s Creed',
    year: 2016,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Dustin Kurzel'
  },
  {
    title: 'Ready Player One',
    year: 2018,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Steven Spielberg'
  },
  {
    title: 'Captain Marvel',
    year: 2019,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: ['Anna Boden', 'Ryan Fleck']
  },
  {
    title: 'The Tomorrow War',
    year: 2021,
    genre: ['Action', 'Adventure', 'Drama'],
    director: 'Chris McKay'
  },
  {
    title: 'Dune',
    year: 2021,
    genre: ['Action', 'Adventure', 'Drama'],
    director: 'Denis Villeneuve'
  }
];

//middleware
app.use(morgan('common'));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

// Get the list of data about all movies
app.get('/movies', (req, res) => {
  res.json(favoriteMovies);
});

// Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning movie by title');
});

//Return data about a genre to the user
app.get('/movies/genres/:name', (req, res) => {
  res.send('Successful GET request retuning movie by genre');
});

//Return data about a director to the user
app.get('/movies/directors/:name', (req, res) => {
  res.send('Successful GET request of directors information');
});

// Allow new users to register
app.post('/users', (req, res) => {
  res.send('Successful POST request for creating a new user registeration');
});

// Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  res.send('Successful PUT request for updating user information');
});

// Allow users to add a movie to their list of favorites
app.post('/users/:username/favorites', (req, res) => {
  res.send('Successful POST request for adding a favorite movie on the user\'s list');
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/favorites', (req, res) => {
  res.send('Successful DELETE request for removing a favorite movie on the user\'s list');
});

// Allow existing user to deregister
app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request, user has been deregistered!');
});

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Broke');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});