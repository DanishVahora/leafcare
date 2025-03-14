const express = require('express');
const { getCurrentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route - requires authentication
router.get('/me', protect, getCurrentUser);

module.exports = router;