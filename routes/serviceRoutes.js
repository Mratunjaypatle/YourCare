const express = require('express');
const router = express.Router();
const {
  getServices, createService, updateService,
  getMembershipPlans, createMembershipPlan, getPayments
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getServices).post(createService);
router.put('/:id', updateService);
router.route('/membership-plans').get(getMembershipPlans).post(createMembershipPlan);
router.get('/payments', getPayments);


module.exports = router;
