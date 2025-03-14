const User = require('../models/userModel');
const Subscription = require('../models/Subscription');

// Middleware to check if user has an active subscription
exports.checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user with populated subscription
    const user = await User.findById(userId).populate('subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is admin (always has access)
    if (user.role === 'admin') {
      req.isSubscribed = true;
      return next();
    }
    
    // Check if user has an active subscription
    if (!user.subscription || !user.subscription.isActive()) {
      // If subscription exists but is expired, update user role
      if (user.subscription && user.role === 'pro') {
        await User.findByIdAndUpdate(userId, { role: 'user' });
      }
      
      req.isSubscribed = false;
      return res.status(403).json({ 
        message: 'This feature requires an active Pro subscription',
        requiresUpgrade: true
      });
    }
    
    // User has active subscription
    req.isSubscribed = true;
    req.subscription = user.subscription;
    next();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ message: 'Failed to verify subscription status' });
  }
};

// Middleware to check specific feature access
exports.checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Get user
      const user = await User.findById(userId).populate('subscription');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check feature access
      const hasAccess = await user.hasFeatureAccess(feature);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          message: `This feature requires a Pro subscription with ${feature} access`,
          requiresUpgrade: true,
          feature
        });
      }
      
      next();
    } catch (error) {
      console.error('Error checking feature access:', error);
      res.status(500).json({ message: 'Failed to verify feature access' });
    }
  };
};
