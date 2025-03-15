const User = require('../models/userModel'); // Ensure the user model is imported
const { generateToken } = require('../utils/tokenUtils');



exports.oauthLogin = async (req, res) => {
    try {
        const { provider, email, firstName, lastName, photo, accessToken } = req.body;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = new User({
                email,
                firstName,
                lastName,
                photo,
                role: 'user',
                authProviders: [{
                    provider,
                    accessToken
                }]
            });
            await user.save();
        } else {
            // Update existing user's OAuth info
            const providerExists = user.authProviders?.find(p => p.provider === provider);
            if (providerExists) {
                providerExists.accessToken = accessToken;
            } else {
                user.authProviders = user.authProviders || [];
                user.authProviders.push({
                    provider,
                    accessToken
                });
            }
            await user.save();
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Return user data and token
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo,
                role: user.role
            }
        });

    } catch (error) {
        console.error("OAuth Login Error:", error);
        res.status(500).json({ 
            message: "Error during OAuth login", 
            error: error.message 
        });
    }
};