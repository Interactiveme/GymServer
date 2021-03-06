var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var VerifyToken = require('../auth/VerifyToken');


router.get('/me', VerifyToken, function(req, res) {
    
      User.findById(req.userId,{ password: 0 }, function (err, user) {
        if (err) return res.status(500).send({message:"There was a problem finding the user."});
        if (!user) return res.status(404).send({message:"No user found."});
        
        res.status(200).send(user);
      });
    
  });

// CREATES A NEW USER
router.post('/register', function (req, res) {
    console.log(req.body);
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);    
    User.create({
            userName : req.body.userName,
            password : hashedPassword
        }, 
        function (err, user) {
            if (err) {
            console.log(err);
                return res.status(500).send({message:"There was a problem adding the information to the database."});
            }

            // create a token
            var token = jwt.sign({ id: user._id }, "secret", {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, userName:user.userName });
        });
});

router.post('/login', function(req, res) {
    User.findOne({ userName: req.body.userName }, function (err, user) {
        if (err) return res.status(500).send({message:'Error on the server.'});
        if (!user) return res.status(404).send({message:'No user found.'});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, "secret", {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token , userName:user.userName});
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send({message:"There was a problem finding the users."});
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send({message:"There was a problem finding the user."});
        if (!user) return res.status(404).send({message:"No user found."});
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send({message:"There was a problem deleting the user."});
        res.status(200).send({message:"User: "+ user.name +" was deleted."});
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send({message:"There was a problem updating the user."});
        res.status(200).send(user);
    });
});


module.exports = router;