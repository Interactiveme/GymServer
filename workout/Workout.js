var mongoose = require('mongoose');

// Workout Schema.
var WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

mongoose.model('Workout', WorkoutSchema);
module.exports = mongoose.model('Workout');
