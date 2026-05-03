const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode the token to get admin ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach admin info to the request object
      req.admin = await Admin.findById(decoded.id).select('-password');

      next(); // proceed to the actual route
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };