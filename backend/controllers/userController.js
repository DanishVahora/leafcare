const User = require('../models/userModel');

exports.getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photo: user.photo,
        role: user.role,
        subscription: user.subscription,
        usageStats: user.usageStats
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};