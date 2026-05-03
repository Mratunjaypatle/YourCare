const express = require('express');
const router = express.Router();
const {
  getWorkoutPlans, getWorkoutPlan, createWorkoutPlan,
  updateWorkoutPlan, deleteWorkoutPlan, assignWorkout
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getWorkoutPlans).post(createWorkoutPlan);
router.route('/:id').get(getWorkoutPlan).put(updateWorkoutPlan).delete(deleteWorkoutPlan);
router.post('/assign', assignWorkout);

module.exports = router;

