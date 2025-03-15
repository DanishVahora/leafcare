const Subscription = require('../models/Subscription');
const User = require('../models/userModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order for subscription
exports.createSubscriptionOrder = async (req, res) => {
  try {
    const { plan, couponCode } = req.body;
    const userId = req.user._id;
    
    // Validate plan
    if (!['monthly', 'annual'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    
    // Calculate amount based on plan
    let amount = plan === 'monthly' ? 999 : 9990;  // In INR
    
    // Create shorter receipt ID (must be <= 40 chars for Razorpay)
    // Use first 8 chars of userId + timestamp in base36 format
    const shortUserId = userId.toString().substring(0, 8);
    const timestamp = Date.now().toString(36); // Convert to base36 for shorter string
    let receipt = `s_${shortUserId}_${timestamp}`;
    
    // Ensure receipt is <= 40 chars (Razorpay requirement)
    if (receipt.length > 40) {
        receipt = receipt.substring(0, 40);
    }
    
    let discountApplied = false;
    
    // Apply coupon if valid
    if (couponCode) {
      // Valid coupons: PLANT15, NEWYEAR
      if (['PLANT15', 'NEWYEAR'].includes(couponCode.toUpperCase())) {
        amount = Math.floor(amount * 0.85);  // 15% discount
        discountApplied = true;
      }
    }
    
    // Create order in Razorpay
    const options = {
      amount: amount * 100,  // Amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        plan: plan,
        couponCode: couponCode || 'none'
      }
    };
    
    console.log('Creating Razorpay order with receipt:', receipt, '(length:', receipt.length, ')');
    const order = await razorpay.orders.create(options);
    
    // Return order details to client
    res.status(200).json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      receipt: order.receipt,
      discountApplied
    });
  } catch (error) {
    console.error('Error creating subscription order:', error);
    // Add more detailed error logging
    if (error.error) {
      console.error('Razorpay API error details:', JSON.stringify(error.error, null, 2));
    }
    res.status(500).json({ message: 'Failed to create subscription order' });
  }
};

// Verify and process subscription payment
exports.verifySubscriptionPayment = async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      plan,
      couponCode 
    } = req.body;
    
    // Enhanced error checking for user ID
    if (!req.user || !req.user._id) {
      console.error('Authentication error: req.user.id is missing');
      return res.status(401).json({ message: 'Authentication failed - user ID not found in token' });
    }
    
    const userId = req.user._id;
    console.log('Processing payment for user:', userId);
    
    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
      console.log(generatedSignature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    // Get order details to verify amount
    const order = await razorpay.orders.fetch(razorpay_order_id);
    
    // Find user with better error handling
    let user;
    try {
      user = await User.findById(userId).populate('subscription');
      if (!user) {
        console.error(`User not found with ID: ${userId}`);
        return res.status(404).json({ 
          message: 'User not found',
          details: 'The user associated with this token could not be found in the database'
        });
      }
    } catch (dbError) {
      console.error('Database error when finding user:', dbError);
      return res.status(500).json({ 
        message: 'Database error when finding user',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
    
    // Rest of the function remains the same
    let subscription = user.subscription || null;
    
    // Calculate subscription end date
    const now = new Date();
    const endDate = new Date(now);
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // If there's an existing active subscription, extend it
    if (subscription && typeof subscription.isActive === 'function' && subscription.isActive()) {
      subscription = await Subscription.findByIdAndUpdate(
        subscription._id,
        {
          plan,
          endDate: subscription.extend(plan).endDate,
          'paymentDetails.razorpayPaymentId': razorpay_payment_id,
          'paymentDetails.razorpayOrderId': razorpay_order_id,
          'paymentDetails.amount': order.amount / 100,
          'paymentDetails.currency': order.currency,
          'paymentDetails.receipt': order.receipt,
          'paymentDetails.couponUsed': couponCode || null,
          'paymentDetails.discountApplied': !!couponCode
        },
        { new: true }
      );
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        userId,
        plan,
        status: 'active',
        startDate: now,
        endDate,
        paymentDetails: {
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          amount: order.amount / 100,
          currency: order.currency,
          receipt: order.receipt,
          couponUsed: couponCode || null,
          discountApplied: !!couponCode
        }
      });
      
      // Update user
      await User.findByIdAndUpdate(userId, {
        role: 'pro',
        subscription: subscription._id
      });
    }
    
    res.status(200).json({
      success: true,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        features: subscription.features
      }
    });
  } catch (error) {
    console.error('Error verifying subscription payment:', error);
    return res.status(500).json({ 
      message: 'Failed to process subscription payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user's subscription details
exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('subscription');
    
    if (!user.subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    // Create a clean subscription object to send to the client
    const subscription = {
      id: user.subscription._id,
      status: user.subscription.status,
      plan: user.subscription.plan,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      features: user.subscription.features,
      isActive: user.subscription.isActive(),
      usageStats: user.usageStats
    };
    
    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ message: 'Failed to fetch subscription details' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('subscription');
    
    if (!user.subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    // Update subscription status to canceled
    await Subscription.findByIdAndUpdate(user.subscription._id, {
      status: 'canceled'
    });
    
    // Note: We're not downgrading the user's role immediately
    // They'll keep pro access until the subscription end date
    
    res.status(200).json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};

// Track feature usage
exports.trackFeatureUsage = async (req, res) => {
    try {
      const userId = req.user._id;
      const { feature } = req.body;
      
      // Validate the feature
      const validFeatures = ['scan', 'export', 'apiCall'];
      if (!validFeatures.includes(feature)) {
        return res.status(400).json({ message: 'Invalid feature' });
      }
      
      const now = new Date();
      let updateIncrement = {};
      let updateSet = {};
      
      // Update appropriate usage counter
      switch (feature) {
        case 'scan':
          updateIncrement = {
            'usageStats.totalScans': 1,
            'usageStats.scanThisMonth': 1
          };
          updateSet = {
            'usageStats.lastScanDate': now
          };
          
          // Also update the scan count on the subscription
          if (req.user.subscription) {
            await Subscription.findByIdAndUpdate(req.user.subscription, {
              $inc: { scanCount: 1 }
            });
          }
          break;
          
        case 'export':
          updateIncrement = {
            'usageStats.exportsCount': 1
          };
          break;
          
        case 'apiCall':
          updateIncrement = {
            'usageStats.apiCallsCount': 1
          };
          break;
      }
      
      // Update user stats using separate operations for increment and set
      await User.findByIdAndUpdate(userId, {
        $inc: updateIncrement,
        $set: updateSet
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      res.status(500).json({ 
        message: 'Failed to track feature usage',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
// Get subscription plans and benefits (for displaying on frontend)
exports.getSubscriptionPlans = async (req, res) => {
  try {
    // This could come from a database in a real app
    const plans = [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: 999,
        originalPrice: 1299,
        period: 'month',
        description: 'Full access to all Pro features on a monthly billing cycle'
      },
      {
        id: 'annual',
        name: 'Annual Plan',
        price: 9990,
        originalPrice: 15588,
        period: 'year',
        savings: 'Save ₹5,598 (36%)',
        description: 'Full access to all Pro features at our best value rate'
      }
    ];
    
    const benefits = [
      {
        title: "Unlimited Scans",
        description: "Scan unlimited plant images for disease detection with no daily restrictions",
        featureKey: "unlimitedScans"
      },
      {
        title: "Advanced Analytics",
        description: "Access detailed analysis reports with treatment recommendations",
        featureKey: "advancedAnalytics"
      },
      {
        title: "Data Export",
        description: "Export your data in multiple formats (CSV, PDF, JSON)",
        featureKey: "dataExport"
      },
      {
        title: "Historical Data",
        description: "Access historical scans and track progress over time",
        featureKey: "historicalData"
      },
      {
        title: "Premium Support",
        description: "Get prioritized support from our plant health experts",
        featureKey: "premiumSupport"
      },
      {
        title: "API Access",
        description: "Integrate our AI directly into your own applications",
        featureKey: "apiAccess"
      }
    ];
    
    res.status(200).json({ plans, benefits });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plans' });
  }
};

// Admin: Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    
    // Filter by status if provided
    if (status && ['active', 'canceled', 'expired'].includes(status)) {
      query.status = status;
    }
    
    // Paginate results
    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await Subscription.countDocuments(query);
    
    res.status(200).json({
      subscriptions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
};
