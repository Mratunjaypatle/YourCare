const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Paste your actual connection string here
// Example: 'mongodb://127.0.0.1:27017/gymDB' or your MongoDB Atlas URI
const DB_URI = 'mongodb://127.0.0.1:27017/gymmanagement'; 

const createAdmin = async () => {
  try {
    await mongoose.connect(DB_URI);
    await Admin.create({
      name: 'Admin',
      email: 'admin@gym.com',
      password: 'admin123', // Send plain text
    });

    console.log('✅ Admin saved successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();