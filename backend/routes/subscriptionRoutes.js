const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');
const { verifyRazorpaySignature } = require('../middleware/verifySignature');
const { checkSubscription, checkFeatureAccess } = require('../middleware/checkSubscription');

const router = express.Router();

// Public routes
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Protected routes (require authentication)
router.post('/create-order', protect, subscriptionController.createSubscriptionOrder);
router.post('/verify-payment', protect, verifyRazorpaySignature, subscriptionController.verifySubscriptionPayment);
router.get('/user-subscription', protect, subscriptionController.getUserSubscription);
router.post('/cancel', protect, checkSubscription, subscriptionController.cancelSubscription);
router.post('/track-usage', protect, subscriptionController.trackFeatureUsage);

// Admin routes
router.get('/all', protect, subscriptionController.getAllSubscriptions);

module.exports = router;
