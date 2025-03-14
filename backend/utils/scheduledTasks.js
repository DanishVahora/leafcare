const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/userModel');

// Function to check for expired subscriptions and update status
const checkExpiredSubscriptions = async () => {
  console.log('Running scheduled task: checking expired subscriptions');
  const now = new Date();
  
  try {
    // Find all active subscriptions that have ended
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: now }
    });
    
    console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);
    
    // Update each expired subscription
    for (const subscription of expiredSubscriptions) {
      // Set subscription to expired
      subscription.status = 'expired';
      await subscription.save();
      
      // Update user role from pro to user
      await User.findByIdAndUpdate(subscription.userId, {
        role: 'user'
      });
      
      console.log(`Subscription ${subscription._id} for user ${subscription.userId} marked as expired`);
    }
  } catch (error) {
    console.error('Error processing expired subscriptions:', error);
  }
};

// Function to reset monthly usage counters on the 1st of each month
const resetMonthlyCounts = async () => {
  console.log('Resetting monthly usage counters');
  
  try {
    // Reset scanThisMonth for all users
    await User.updateMany({}, {
      'usageStats.scanThisMonth': 0
    });
    
    console.log('Monthly scan counts reset successfully');
  } catch (error) {
    console.error('Error resetting monthly counts:', error);
  }
};

// Set up scheduled tasks
const setupScheduledTasks = () => {
  // Check for expired subscriptions daily at midnight
  cron.schedule('0 0 * * *', checkExpiredSubscriptions);
  
  // Reset monthly counters on the 1st of each month
  cron.schedule('0 0 1 * *', resetMonthlyCounts);
};

module.exports = { setupScheduledTasks };
