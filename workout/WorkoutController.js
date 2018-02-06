var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../auth/VerifyToken');


router.use(bodyParser.urlencoded({ extended: true }));
var Workout = require('./Workout');
   
router.post('/',VerifyToken, function (req, res) {
    var workout = {
        name : req.body.name,
        userId:req.userId
    };
    
    Workout.create(workout, 
        function (err, workout) {
            if (err) return res.status(500).send({message:"There was a problem adding the information to the database."});
            res.status(200).send(workout);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    
    Workout.find({userId: req.userId}, function (err, workout) {
        if (err) return res.status(500).send({message:"There was a problem finding the workout."});
        res.status(200).send(workout);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken,function (req, res) {
    Workout.findById(req.params.id, function (err, workout) {
        if (err) return res.status(500).send({message:"There was a problem finding the workout."});
        if (!workout) return res.status(404).send({message:"No workout found."});
        res.status(200).send(workout);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken,function (req, res) {
    Workout.findByIdAndRemove(req.params.id, function (err, workout) {
        if (err) {
            return res.status(500).send({message:"There was a problem deleting the workout."});
        }

        res.status(200).send({message:"Workout: "+ workout.name +" was deleted."});
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id',VerifyToken, function (req, res) {
    var workout = {
        name : req.body.name,
        userId:req.userId
    };
    Workout.findByIdAndUpdate(req.params.id, workout, {new: true}, function (err, workout) {
        if (err) return res.status(500).send({message:"There was a problem updating the workout."});
        res.status(200).send(workout);
    });
});


module.exports = router;