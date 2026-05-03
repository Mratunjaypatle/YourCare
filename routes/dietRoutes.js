const express = require('express');
const router = express.Router();
const {
  getDietPlans, getDietPlan, createDietPlan, updateDietPlan, assignDiet
} = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getDietPlans).post(createDietPlan);
router.route('/:id').get(getDietPlan).put(updateDietPlan);
router.post('/assign', assignDiet);

module.exports = router;
