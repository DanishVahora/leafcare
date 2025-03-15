const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrentUser,
  updateProfile,
  changePassword,
  getUserStats,
  getAllUsers
} = require('../controllers/userController');

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/stats', protect, getUserStats);
router.patch('/update-profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

// Admin routes
router.get('/all', protect, getAllUsers);

module.exports = router;