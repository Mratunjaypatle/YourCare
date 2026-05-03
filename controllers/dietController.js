const DietPlan = require('../models/DietPlan');
const Member = require('../models/Member');

const getDietPlans = async (req, res) => {
  try {
    const { type, goal } = req.query;
    let query = { isActive: true };
    if (type) query.type = type;
    if (goal) query.goal = goal;
    const plans = await DietPlan.find(query);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignDiet = async (req, res) => {
  try {
    const { memberId, dietPlanId } = req.body;
    const member = await Member.findByIdAndUpdate(
      memberId,
      { assignedDiet: dietPlanId },
      { new: true }
    ).populate('assignedDiet');
    res.json({ message: 'Diet plan assigned successfully', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDietPlans, getDietPlan, createDietPlan, updateDietPlan, assignDiet };

