const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
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

module.exports = mongoose.model('User', userSchema);