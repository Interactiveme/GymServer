var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var Exercise = require('./Exercise');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var VerifyToken = require('../auth/VerifyToken');

router.get('/:id', VerifyToken,function (req, res) {
    Exercise.find({workoutId:req.params.id, userId:req.userId}, function (err, exercises) {
        if (err) return res.status(500).send({message:"There was a problem finding the exercises."});
        if (!exercises) return res.status(404).send({message:"No exercises found."});
        res.status(200).send(exercises);
    });
});

router.get('/:id/:exerciseId', VerifyToken,function (req, res) {
    Exercise.findOne({_id:req.params.exerciseId,workoutId:req.params.id, userId:req.userId}, function (err, exercises) {
        if (err) return res.status(500).send({message:"There was a problem finding the exercises."});
        if (!exercises) return res.status(404).send({message:"No exercises found."});
        res.status(200).send(exercises);
    });
});

router.put('/:id',VerifyToken, function (req, res) {
    var newExercise = {
        name : req.body.name,     
        workoutId:req.body.workoutId,     
        weight:req.body.weight,     
        reps:req.body.reps,     
        sets:req.body.sets,
        userId:req.userId
    };
    Exercise.findByIdAndUpdate(req.params.id, newExercise, {new: true}, function (err, exercise) {
        if (err) return res.status(500).send({message:"There was a problem updating the exercise."});
        console.log('durp',exercise);
        res.status(200).send(exercise);
    });
});

router.post('/', VerifyToken, function (req, res) {
    console.log(req.body);
    var newExercise = {
        name : req.body.name,     
            workoutId:req.body.workoutId,     
            weight:req.body.weight,     
            reps:req.body.reps,     
            sets:req.body.sets,
            userId:req.userId
    };

    console.log(newExercise);
    Exercise.create(newExercise, 
        function (err, exercise) {
            if (err) {
            console.log(err);
                return res.status(500).send({message:"There was a problem adding the information to the database."});
            }

            res.status(200).send(exercise);
        });
});


router.delete('/:id', VerifyToken,function (req, res) {
    Exercise.findByIdAndRemove(req.params.id, function (err, exercise) {
        if (err) {
            return res.status(500).send({message:"There was a problem deleting the exercise."});
        }

        res.status(200).send({message:"Exercise: "+ exercise.name +" was deleted."});
    });
});

module.exports = router;