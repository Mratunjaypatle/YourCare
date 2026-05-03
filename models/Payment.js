// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Member',
      required: [true, 'Member is required'],
    },
    amount: {
      type:     Number,
      required: [true, 'Amount is required'],
      min:      [0, 'Amount cannot be negative'],
    },
    paymentDate: {
      type:    Date,
      default: Date.now,
    },
    paymentMethod: {
      type:    String,
      enum:    ['cash', 'card', 'upi', 'bank_transfer', 'online'],
      default: 'cash',
    },
    paymentFor: {
      type:     String,
      enum:     ['membership', 'service', 'other'],
      required: [true, 'Payment purpose is required'],
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'MembershipPlan',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Service',
    },
    notes: {
      type:    String,
      default: '',
    },
    status: {
      type:    String,
      enum:    ['completed', 'pending', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);