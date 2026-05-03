// backend/models/Member.js
const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, 'Name is required'], trim: true },
    email:   { type: String, lowercase: true, trim: true, default: null },
    age:     { type: Number, required: [true, 'Age is required'], min: 5, max: 100 },
    gender:  { type: String, enum: ['male', 'female', 'other'], required: [true, 'Gender is required'] },
    phone:   { type: String, required: [true, 'Phone is required'], trim: true },
    address: { type: String, default: '' },

    joiningDate: { type: Date, default: Date.now },

    // ── NEW: Profile photo fields ─────────────────────
    profilePhoto:   { type: String, default: null }, // Cloudinary URL
    photoPublicId:  { type: String, default: null }, // Cloudinary public_id for deletion

    membershipPlan:   { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', default: null },
    membershipExpiry: { type: Date,   default: null },
    membershipStatus: { type: String, enum: ['active', 'expired', 'pending'], default: 'pending' },

    assignedWorkout: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
    assignedDiet:    { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan',    default: null },

    weight: { type: Number, default: null },
    height: { type: Number, default: null },
    goal: {
      type:    String,
      enum:    ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
      default: 'maintenance',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

// Auto-update membership status on save
memberSchema.pre('save', function (next) {
  if (this.membershipExpiry) {
    this.membershipStatus = this.membershipExpiry > new Date() ? 'active' : 'expired'
  }
  next()
})

module.exports = mongoose.model('Member', memberSchema)