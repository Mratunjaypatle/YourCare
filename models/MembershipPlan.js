// backend/models/MembershipPlan.js
const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Plan name is required'],
      trim:     true,
    },
    duration: {
      type:     Number,
      required: [true, 'Duration is required'],
      // Duration in DAYS: 30 = monthly, 90 = quarterly, 365 = yearly
    },
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative'],
    },
    features: {
      type:    [String],
      default: [],
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);