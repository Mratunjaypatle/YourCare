const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get("/check" , (req,res) => res.json({message : "hello"}))
router.post("/check", (req, res) => {
  res.json({
    message: "hello dear",
    data: req.body
  });
});
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
