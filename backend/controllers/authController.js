const User = require('../models/userModel'); // Ensure the user model is imported
const { generateToken } = require('../utils/tokenUtils');

// Controller function for signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, provider, providerId, photo, accessToken, refreshToken } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      photo, // Save the photo URL
      password: provider ? undefined : password, // Only set password for email/password users
      authProviders: provider ? [{ provider, providerId, accessToken, refreshToken }] : undefined
    });

    await newUser.save();

    // Generate a JWT token
    const token = generateToken(newUser._id, provider ? 'oauth' : 'jwt');

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser._id, email: newUser.email, photo: newUser.photo },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, provider, providerId, photo, accessToken, refreshToken } = req.body;

  try {
    let user;

    if (provider) {
      // Handle OAuth login
      user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'User not found. Please sign up first.' });
      }

      // Update or add OAuth provider details
      const existingProvider = user.authProviders.find(p => p.provider === provider);
      if (existingProvider) {
        existingProvider.accessToken = accessToken;
        existingProvider.refreshToken = refreshToken;
      } else {
        user.authProviders.push({ provider, providerId, accessToken, refreshToken });
      }

      // Update the photo URL if it's provided
      if (photo) {
        user.photo = photo;
      }

      await user.save();
    } else {
      // Handle email/password login
      user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Generate a JWT token
    const token = generateToken(user._id, provider ? 'oauth' : 'jwt');

    res.json({
      success: true,
      user: { id: user._id, email: user.email, photo: user.photo },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};