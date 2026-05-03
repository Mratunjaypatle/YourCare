// backend/controllers/memberController.js
const mongoose                            = require('mongoose')
const Member                              = require('../models/Member')
const MembershipPlan                      = require('../models/MembershipPlan')
const Payment                             = require('../models/Payment')
const { deleteFromCloudinary }            = require('../config/cloudinary')

// ── GET /api/members ──────────────────────────────────────────
const getMembers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query
    const query = {}

    if (status && status !== 'all') query.membershipStatus = status

    if (search && search.trim()) {
      query.$or = [
        { name:  { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.max(1, parseInt(limit))

    const [total, members] = await Promise.all([
      Member.countDocuments(query),
      Member.find(query)
        .populate('membershipPlan',  'name price duration')
        .populate('assignedWorkout', 'name level')
        .populate('assignedDiet',    'name type')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ])

    return res.json({ members, total, page: pageNum, pages: Math.ceil(total / limitNum) })
  } catch (err) {
    console.error('getMembers error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

// ── GET /api/members/:id ──────────────────────────────────────
const getMember = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid member ID' })

    const member = await Member.findById(req.params.id)
      .populate('membershipPlan')
      .populate('assignedWorkout')
      .populate('assignedDiet')

    if (!member) return res.status(404).json({ message: 'Member not found' })
    return res.json(member)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// ── POST /api/members ─────────────────────────────────────────
// Accepts multipart/form-data (text fields + optional photo file)
const createMember = async (req, res) => {
  try {
    console.log('📥 createMember body:', req.body)
    console.log('📸 createMember file:', req.file ? req.file.path : 'no photo')

    const {
      name, phone, age, gender,
      email, address, goal,
      weight, height, membershipPlanId,
      notes, paymentMethod = 'cash',
    } = req.body

    // Validate required fields
    if (!name  || !String(name).trim())  return res.status(400).json({ message: 'Name is required' })
    if (!phone || !String(phone).trim()) return res.status(400).json({ message: 'Phone is required' })
    if (!age)                            return res.status(400).json({ message: 'Age is required' })
    if (!gender)                         return res.status(400).json({ message: 'Gender is required' })

    const memberData = {
      name:    String(name).trim(),
      phone:   String(phone).trim(),
      age:     Number(age),
      gender:  String(gender),
      address: address ? String(address).trim() : '',
      goal:    goal    || 'maintenance',
      notes:   notes   ? String(notes).trim() : '',
      email:   (email && String(email).trim()) ? String(email).trim().toLowerCase() : null,
      weight:  (weight && Number(weight) > 0)  ? Number(weight) : null,
      height:  (height && Number(height) > 0)  ? Number(height) : null,
    }

    // ── Photo: if Multer uploaded it, req.file has Cloudinary result ──
    if (req.file) {
      memberData.profilePhoto  = req.file.path      // full Cloudinary URL
      memberData.photoPublicId = req.file.filename   // public_id for deletion later
    }

    // ── Membership plan ───────────────────────────────────────
    let selectedPlan = null
    if (membershipPlanId && mongoose.Types.ObjectId.isValid(membershipPlanId)) {
      selectedPlan = await MembershipPlan.findById(membershipPlanId)
      if (selectedPlan) {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + Number(selectedPlan.duration))
        memberData.membershipPlan   = selectedPlan._id
        memberData.membershipExpiry = expiry
        memberData.membershipStatus = 'active'
      }
    }

    const member = await Member.create(memberData)

    // Auto-record payment if plan was selected
    if (selectedPlan) {
      await Payment.create({
        member:         member._id,
        amount:         selectedPlan.price,
        paymentMethod:  paymentMethod || 'cash',
        paymentFor:     'membership',
        membershipPlan: selectedPlan._id,
        status:         'completed',
        notes:          `New membership — ${selectedPlan.name}`,
      })
    }

    const result = await Member.findById(member._id)
      .populate('membershipPlan', 'name price duration')

    return res.status(201).json(result)
  } catch (err) {
    console.error('createMember error:', err)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field'
      return res.status(400).json({ message: `A member with this ${field} already exists` })
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join('. ') })
    }
    return res.status(500).json({ message: err.message })
  }
}

// ── PUT /api/members/:id ──────────────────────────────────────
// Also handles optional new photo upload
const updateMember = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid member ID' })

    const existing   = await Member.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Member not found' })

    const updateData = { ...req.body }

    // Handle membership plan change
    if (updateData.membershipPlanId) {
      const plan = await MembershipPlan.findById(updateData.membershipPlanId)
      if (plan) {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + Number(plan.duration))
        updateData.membershipPlan   = updateData.membershipPlanId
        updateData.membershipExpiry = expiry
        updateData.membershipStatus = 'active'
      }
      delete updateData.membershipPlanId
    }

    // Clean optional fields
    if (updateData.email  === '') updateData.email  = null
    if (!updateData.weight)       updateData.weight = null
    if (!updateData.height)       updateData.height = null

    // ── Handle new photo upload ────────────────────────────────
    if (req.file) {
      // Delete old photo from Cloudinary first
      if (existing.profilePhoto) {
        await deleteFromCloudinary(existing.profilePhoto)
      }
      updateData.profilePhoto  = req.file.path
      updateData.photoPublicId = req.file.filename
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('membershipPlan', 'name price duration')
      .populate('assignedWorkout')
      .populate('assignedDiet')

    return res.json(member)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate value — check email or phone' })
    return res.status(500).json({ message: err.message })
  }
}

// ── DELETE /api/members/:id ───────────────────────────────────
// Deletes member + all their payments + their Cloudinary photo
const deleteMember = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid member ID' })

    const member = await Member.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Member not found' })

    // 1. Delete photo from Cloudinary
    if (member.profilePhoto) {
      await deleteFromCloudinary(member.profilePhoto)
      console.log(`🗑️  Photo deleted for: ${member.name}`)
    }

    // 2. Delete all payments for this member
    const paymentResult = await Payment.deleteMany({ member: req.params.id })
    console.log(`🗑️  Deleted ${paymentResult.deletedCount} payment(s) for: ${member.name}`)

    // 3. Delete the member
    await Member.findByIdAndDelete(req.params.id)

    return res.json({
      message:         `"${member.name}" deleted with ${paymentResult.deletedCount} payment(s)`,
      deletedPayments: paymentResult.deletedCount,
    })
  } catch (err) {
    console.error('deleteMember error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

// ── DELETE /api/members/:id/photo ────────────────────────────
// Remove just the photo, keep the member record
const deleteMemberPhoto = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid member ID' })

    const member = await Member.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Member not found' })

    if (member.profilePhoto) {
      await deleteFromCloudinary(member.profilePhoto)
    }

    await Member.findByIdAndUpdate(req.params.id, {
      profilePhoto:  null,
      photoPublicId: null,
    })

    return res.json({ message: 'Photo removed successfully' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// ── POST /api/members/:id/renew ───────────────────────────────
const renewMembership = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid member ID' })

    const { membershipPlanId, paymentMethod = 'cash' } = req.body
    if (!membershipPlanId) return res.status(400).json({ message: 'membershipPlanId is required' })

    const [member, plan] = await Promise.all([
      Member.findById(req.params.id),
      MembershipPlan.findById(membershipPlanId),
    ])
    if (!member) return res.status(404).json({ message: 'Member not found' })
    if (!plan)   return res.status(404).json({ message: 'Plan not found' })

    const startDate = (member.membershipExpiry && member.membershipExpiry > new Date())
      ? new Date(member.membershipExpiry) : new Date()
    const newExpiry = new Date(startDate)
    newExpiry.setDate(newExpiry.getDate() + Number(plan.duration))

    member.membershipPlan   = plan._id
    member.membershipExpiry = newExpiry
    member.membershipStatus = 'active'
    await member.save()

    await Payment.create({
      member: member._id, amount: plan.price,
      paymentMethod, paymentFor: 'membership',
      membershipPlan: plan._id, status: 'completed',
      notes: `Renewal — ${plan.name}`,
    })

    const updated = await Member.findById(member._id)
      .populate('membershipPlan').populate('assignedWorkout').populate('assignedDiet')

    return res.json({
      message: `Membership renewed until ${newExpiry.toDateString()}`,
      member:  updated,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// ── POST /api/members/:id/assign-workout ─────────────────────
const assignWorkout = async (req, res) => {
  try {
    const { workoutPlanId } = req.body
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { assignedWorkout: workoutPlanId },
      { new: true }
    ).populate('assignedWorkout')
    return res.json(member)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// ── POST /api/members/:id/assign-diet ────────────────────────
const assignDiet = async (req, res) => {
  try {
    const { dietPlanId } = req.body
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { assignedDiet: dietPlanId },
      { new: true }
    ).populate('assignedDiet')
    return res.json(member)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  deleteMemberPhoto,
  renewMembership,
  assignWorkout,
  assignDiet,
}