var mongoose = require('mongoose');  
var ExerciseSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true
  },
  workoutId: {
    type: String,
    required: true
  },
  weight:{
    type:Number,
    required:true
  },
  reps:{
    type:Number,
    required:true
  },
  sets:{
    type:Number,
    required:true
  },
  userId: {
    type: String,
    required: true
  }
});
mongoose.model('Exercise', ExerciseSchema);

module.exports = mongoose.model('Exercise');