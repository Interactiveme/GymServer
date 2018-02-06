var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token ');
    
    next();
  });

var db = require('./db');

var UserController = require('./user/UserController');
var WorkoutController = require('./workout/WorkoutController');
var ExerciseController = require('./exercise/ExerciseController');


app.use('/user', UserController);
app.use('/workouts', WorkoutController);
app.use('/exercises', ExerciseController);



module.exports = app;