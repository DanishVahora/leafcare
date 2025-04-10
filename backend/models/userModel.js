const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true, sparse: true },
  password: { type: String }, // Not required for OAuth users
  photo: { type: String }, // Store the photo URL
  authProviders: [ // For OAuth users
    {
      provider: { type: String }, // e.g., "google", "github"
      providerId: { type: String }, // Unique ID from the OAuth provider
      accessToken: { type: String, select: false }, // Optional: Store if needed
      refreshToken: { type: String, select: false }
    }
  ],
  role: {
    type: String,
    enum: ['user', 'pro', 'admin'],
    default: 'user'
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  // Feature usage tracking
  usageStats: {
    totalScans: { type: Number, default: 0 },
    scanThisMonth: { type: Number, default: 0 },
    lastScanDate: { type: Date, default: null },
    exportsCount: { type: Number, default: 0 },
    apiCallsCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Hash password before saving (only for email/password users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match user-entered password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add a method to check if user has pro subscription
userSchema.methods.isPro = function() {
  return this.role === 'pro' || this.role === 'admin';
};

// Add a method to check feature access
userSchema.methods.hasFeatureAccess = async function(feature) {
  // Admins have access to everything
  if (this.role === 'admin') return true;
  
  // If not pro and feature requires pro, deny access
  if (this.role !== 'pro') return false;
  
  // If pro, check subscription status
  if (!this.subscription) return false;
  
  // Populate the subscription if not already populated
  const subscriptionDoc = mongoose.Types.ObjectId.isValid(this.subscription) ? 
    await mongoose.model('Subscription').findById(this.subscription) : 
    this.subscription;
  
  if (!subscriptionDoc || !subscriptionDoc.isActive()) return false;
  
  // Check specific feature
  switch (feature) {
    case 'unlimitedScans': return subscriptionDoc.features.unlimitedScans;
    case 'advancedAnalytics': return subscriptionDoc.features.advancedAnalytics;
    case 'dataExport': return subscriptionDoc.features.dataExport;
    case 'historicalData': return subscriptionDoc.features.historicalData;
    case 'premiumSupport': return subscriptionDoc.features.premiumSupport;
    case 'apiAccess': return subscriptionDoc.features.apiAccess;
    default: return false;
  }
};

module.exports = mongoose.model('User', userSchema);