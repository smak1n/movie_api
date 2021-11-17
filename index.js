const express = require('express');
const app = express();
const morgan = require('morgan');

//middleware
app.use(morgan('common'));
app.use(express.static('public'));

// my top 10 sci-fy movies
let favoriteMovies = [
  {
    title: 'Inception',
    year: 2010
  },
  {
    title: 'Source Code',
    year: 2011
  },
  {
    title: 'Interstellar',
    year: 2014
  },
  {
    title: 'Edge of Tomorrow',
    year: 2014
  },
  {
    title: 'Jupiter Ascending',
    year: 2015
  },
  {
    title: 'Assassin\'s Creed',
    year: 2016
  },
  {
    title: 'Ready Player One',
    year: 2018
  },
  {
    title: 'Captain Marvel',
    year: 2019
  },
  {
    title: 'The Tomorrow War',
    year: 2021
  },
  {
    title: 'Dune',
    year: 2021
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
  res.json(favoriteMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Broke');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});