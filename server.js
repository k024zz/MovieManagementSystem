// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var movieData = require('./data.js');

// We create our express isntance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // for parsing application/json

// match assets with static
app.use('/assets', express.static('static'));

// HW4 
// The main page
app.get("/", function(request, response) {
    response.render("pages/index");
});

app.post("/rating", function(request, response) {
    movieData.getMovie(request.body.id).then(function(movie) {
        var curRating = movie.rating;
        var newRating = curRating + parseFloat(request.body.rating);
        if(newRating > 5) newRating = 5;
        if(newRating < 0) newRating = 0;
        movieData.updateMovie(movie._id, movie.title, newRating).then(function(moive) {
            response.json("updated");
        });
    });
});

app.post("/delete", function(request, response) {
    movieData.deleteMovie(request.body.id).then(function(movie) {
        response.json("deleted")
    });
});

// If you'll notice, there's not a single database call in the server file!

// Get the best movies
app.get("/api/movies/best", function(request, response) {
    movieData.getPopularMovies().then(function(popularMovies){
        response.json(popularMovies);
    });
});

// Get a single movie
app.get("/api/movies/:id", function(request, response) {
    movieData.getMovie(request.params.id).then(function(movie) {
        response.json(movie);
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// Get all the movies
app.get("/api/movies", function(request, response) {
    movieData.getAllMovies().then(function(movieList) {
        response.json(movieList);
    });
});

// Create a movie
app.post("/api/movies", function(request, response) {
    movieData.createMovie(request.body.title, request.body.rating).then(function(movie) {
        response.json(movie);
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// Update a movie 
app.put("/api/movies/:id", function(request, response) {
    movieData.updateMovie(request.params.id, request.body.title, request.body.rating).then(function(movie) {
        response.json(movie);
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

app.delete("/api/movies/:id", function(request, response) {
    movieData.deleteMovie(request.params.id).then(function(status) {
        response.json({success: status});
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// We can now navigate to localhost:3000
app.listen(3000, function() {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
