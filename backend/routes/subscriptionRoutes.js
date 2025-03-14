const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');
const { checkSubscription } = require('../middleware/checkSubscription');

// Public routes
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Protected routes (require authentication)
router.post('/create-order', protect, subscriptionController.createSubscriptionOrder);
router.post('/verify-payment', protect, subscriptionController.verifySubscriptionPayment);
router.get('/my-subscription', protect, subscriptionController.getUserSubscription);
router.post('/cancel', protect, checkSubscription, subscriptionController.cancelSubscription);
router.post('/track-usage', protect, subscriptionController.trackFeatureUsage);

// Admin routes
router.get('/admin/all', protect, subscriptionController.getAllSubscriptions);

module.exports = router;
