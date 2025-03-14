const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Enhanced protect middleware with better JWT error handling
 */

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token format
      if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
          message: 'No token provided',
          details: 'Please provide a valid authentication token'
        });
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
          return res.status(401).json({
            message: 'User not found',
            details: 'The user associated with this token does not exist'
          });
        }
        
        // Attach user to request
        req.user = user;
        next();
        
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            message: 'Invalid token',
            details: 'The provided token is not valid'
          });
        }
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            message: 'Token expired',
            details: 'Your session has expired, please login again'
          });
        }
        throw error;
      }
    } else {
      return res.status(401).json({
        message: 'Not authorized',
        details: 'No authorization token found in request headers'
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      message: 'Server error in authentication',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Admin middleware - checks if user has admin role
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Not authorized as an admin',
      details: 'This action requires administrator privileges'
    });
  }
};