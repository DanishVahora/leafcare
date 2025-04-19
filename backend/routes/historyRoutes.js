const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  saveHistory,
  getUserHistory,
  deleteHistory
} = require('../controllers/historyController');

router.post('/', protect, saveHistory);
router.get('/', protect, getUserHistory);
router.delete('/:historyId', protect, deleteHistory);

module.exports = router;