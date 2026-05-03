// backend/routes/memberRoutes.js
const express = require('express')
const router  = express.Router()

const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  deleteMemberPhoto,
  renewMembership,
  assignWorkout,
  assignDiet,
} = require('../controllers/memberController')

const { protect }           = require('../middleware/authMiddleware')
const { uploadMemberPhoto } = require('../config/cloudinary')

// All routes require login
router.use(protect)

// ── List / Create ─────────────────────────────────────────────
// uploadMemberPhoto.single('profilePhoto') = Multer middleware
// 'profilePhoto' must match the field name in your form FormData
router.get('/',  getMembers)
router.post('/', uploadMemberPhoto.single('profilePhoto'), createMember)

// ── Single member ─────────────────────────────────────────────
router.get('/:id',    getMember)
router.put('/:id',    uploadMemberPhoto.single('profilePhoto'), updateMember)
router.delete('/:id', deleteMember)

// ── Photo only ────────────────────────────────────────────────
router.delete('/:id/photo', deleteMemberPhoto)

// ── Membership & plans ────────────────────────────────────────
router.post('/:id/renew',          renewMembership)
router.post('/:id/assign-workout', assignWorkout)
router.post('/:id/assign-diet',    assignDiet)

module.exports = router