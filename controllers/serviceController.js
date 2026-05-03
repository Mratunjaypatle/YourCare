// backend/controllers/serviceController.js
const mongoose       = require('mongoose')
const Service        = require('../models/Service')
const MembershipPlan = require('../models/MembershipPlan')
const Payment        = require('../models/Payment')
const Member         = require('../models/Member')

// ─────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 })
    return res.json(services)
  } catch (err) {
    console.error('getServices error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    return res.status(201).json(service)
  } catch (err) {
    console.error('createService error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    if (!service) return res.status(404).json({ message: 'Service not found' })
    return res.json(service)
  } catch (err) {
    console.error('updateService error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// MEMBERSHIP PLANS
// ─────────────────────────────────────────────────────────────
const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 })
    return res.json(plans)
  } catch (err) {
    console.error('getMembershipPlans error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const createMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body)
    return res.status(201).json(plan)
  } catch (err) {
    console.error('createMembershipPlan error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/services/payments  — list all payments
// ─────────────────────────────────────────────────────────────
const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 15, memberId, paymentFor, status } = req.query

    const query = {}

    // Only add filters if they have real values
    if (memberId   && mongoose.Types.ObjectId.isValid(memberId)) query.member     = memberId
    if (paymentFor && paymentFor !== 'all')                      query.paymentFor = paymentFor
    if (status     && status     !== 'all')                      query.status     = status

    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.max(1, parseInt(limit))

    const [total, payments] = await Promise.all([
      Payment.countDocuments(query),
      Payment.find(query)
        .populate('member',         'name phone email')
        .populate('membershipPlan', 'name duration')
        .populate('service',        'name')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ])

    return res.json({ payments, total, page: pageNum })
  } catch (err) {
    console.error('getPayments error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/services/payments — manually record a payment
// ─────────────────────────────────────────────────────────────
const createPayment = async (req, res) => {
  try {
    console.log('createPayment body received:', req.body)

    const {
      memberId,
      amount,
      paymentMethod = 'cash',
      paymentFor    = 'membership',
      membershipPlanId,
      serviceId,
      notes  = '',
      status = 'completed',
    } = req.body

    // ── Validate required fields ─────────────────────────────
    if (!memberId) {
      return res.status(400).json({ message: 'Please select a member' })
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member selected' })
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Please enter a valid amount greater than 0' })
    }

    // ── Check member exists ──────────────────────────────────
    const member = await Member.findById(memberId)
    if (!member) {
      return res.status(404).json({ message: 'Selected member not found in database' })
    }

    // ── Build payment data ───────────────────────────────────
    const paymentData = {
      member:        memberId,
      amount:        Number(amount),
      paymentMethod: paymentMethod || 'cash',
      paymentFor:    paymentFor    || 'membership',
      status:        status        || 'completed',
      notes:         notes ? String(notes).trim() : '',
    }

    // Add membership plan if provided and valid
    if (membershipPlanId && mongoose.Types.ObjectId.isValid(membershipPlanId)) {
      paymentData.membershipPlan = membershipPlanId

      // If paying for membership, also update member's active plan
      if (paymentFor === 'membership') {
        const plan = await MembershipPlan.findById(membershipPlanId)
        if (plan) {
          const startDate = (member.membershipExpiry && member.membershipExpiry > new Date())
            ? new Date(member.membershipExpiry)
            : new Date()

          const newExpiry = new Date(startDate)
          newExpiry.setDate(newExpiry.getDate() + Number(plan.duration))

          await Member.findByIdAndUpdate(memberId, {
            membershipPlan:   plan._id,
            membershipExpiry: newExpiry,
            membershipStatus: 'active',
          })
          console.log(`✅ Member ${member.name} membership extended to ${newExpiry.toDateString()}`)
        }
      }
    }

    // Add service reference if provided and valid
    if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
      paymentData.service = serviceId
    }

    // ── Save payment ─────────────────────────────────────────
    const payment = await Payment.create(paymentData)
    console.log(`💳 Payment ₹${amount} recorded for member: ${member.name}`)

    // Return with populated references
    const result = await Payment.findById(payment._id)
      .populate('member',         'name phone')
      .populate('membershipPlan', 'name duration')
      .populate('service',        'name')

    return res.status(201).json(result)

  } catch (err) {
    console.error('createPayment error:', err)

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ message: messages.join('. ') })
    }

    return res.status(500).json({ message: err.message || 'Server error recording payment' })
  }
}

module.exports = {
  getServices,
  createService,
  updateService,
  getMembershipPlans,
  createMembershipPlan,
  getPayments,
  createPayment,
}