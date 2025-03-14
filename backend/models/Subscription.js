const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['monthly', 'annual'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  features: {
    unlimitedScans: { type: Boolean, default: true },
    advancedAnalytics: { type: Boolean, default: true },
    dataExport: { type: Boolean, default: true },
    historicalData: { type: Boolean, default: true },
    premiumSupport: { type: Boolean, default: true },
    apiAccess: { type: Boolean, default: true }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentDetails: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    amount: Number,
    currency: String,
    receipt: String,
    couponUsed: {
      type: String,
      default: null
    },
    discountApplied: {
      type: Boolean,
      default: false
    }
  },
  scanCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now <= this.endDate;
};

// Method to extend subscription based on plan
subscriptionSchema.methods.extend = function(plan) {
  const now = new Date();
  let extensionDate = new Date(Math.max(now, this.endDate));
  
  if (plan === 'monthly') {
    extensionDate.setMonth(extensionDate.getMonth() + 1);
  } else if (plan === 'annual') {
    extensionDate.setFullYear(extensionDate.getFullYear() + 1);
  }
  
  this.endDate = extensionDate;
  this.status = 'active';
  return this;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
