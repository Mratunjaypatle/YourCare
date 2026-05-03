const mongoose = require('mongoose');
const exerciseSchema = new mongoose.Schema({
  name: String,           // "Push-ups"
  sets: Number,           // 3
  reps: String,           // "12-15" or "30 seconds"
  restTime: String,       // "60 seconds"
  muscleGroup: String,    // "Chest", "Back", etc.
  instructions: String,
});

const workoutDaySchema = new mongoose.Schema({
  day: String,            // "Monday", "Day 1"
  focus: String,          // "Upper Body", "Cardio"
  exercises: [exerciseSchema],
  estimatedDuration: Number, // minutes
});

const workoutPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // "Beginner Full Body", "Advanced Powerlifting"
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
  },
  daysPerWeek: Number,
  schedule: [workoutDaySchema],
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

mongoose.model('WorkoutPlan', workoutPlanSchema);
module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);