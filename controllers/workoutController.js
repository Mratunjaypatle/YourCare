const WorkoutPlan = require('../models/WorkoutPlan');
const Member = require('../models/Member');

const getWorkoutPlans = async (req, res) => {
  try {
    const { level } = req.query;
    const query = level ? { level, isActive: true } : { isActive: true };
    const plans = await WorkoutPlan.find(query);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Workout plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Workout plan deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign workout to member
const assignWorkout = async (req, res) => {
  try {
    const { memberId, workoutPlanId } = req.body;
    const member = await Member.findByIdAndUpdate(
      memberId,
      { assignedWorkout: workoutPlanId },
      { new: true }
    ).populate('assignedWorkout');

    res.json({ message: 'Workout assigned successfully', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkoutPlans, getWorkoutPlan, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan, assignWorkout };

