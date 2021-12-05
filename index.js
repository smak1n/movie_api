const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common'));
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

// Get the list of data about all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {//error callback
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a genre to the user
app.get('/movies/genres/:Name', (req, res) => {
  Movies.find({"Genre.Name": req.params.Name})
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a director to the user
app.get('/movies/directors/:Name', (req, res) => {
  Movies.find({"Director.Name": req.params.Name})
    .then((directors)=> {
      res.status(201).json(directors);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about user by username
app.get('/users/:Username', (req, res) =>{
  Users.findOne({username: req.params.Username})
    .then((users)=> {
      res.status(201).json(users);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to update their user info (by username)
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});

// Allow existing user to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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