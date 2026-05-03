const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    default: 'admin',
  },
}, { timestamps: true });

// Hash password before saving — never store plain text passwords!
adminSchema.pre('save', async function () {
  // If password isn't changed, exit the function
  if (!this.isModified('password')) return;

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  
  // Logic finishes here. Mongoose automatically moves to the next step 
  // because this is an async function.
});

// Method to check password during login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

