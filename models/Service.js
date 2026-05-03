// backend/models/Service.js
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Service name is required'],
      trim:     true,
    },
    description: {
      type:    String,
      default: '',
    },
    pricePerMonth: {
      type: Number,
      min:  [0, 'Price cannot be negative'],
    },
    category: {
      type:    String,
      enum:    ['fitness', 'wellness', 'nutrition', 'other'],
      default: 'fitness',
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Service', serviceSchema)