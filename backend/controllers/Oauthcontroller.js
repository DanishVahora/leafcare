const User = require('../models/userModel'); // Ensure the user model is imported
const { generateToken } = require('../utils/tokenUtils');



exports.oauthLogin = async (req, res) => {
    try {
        let { provider, providerId, email, firstName, lastName, photo } = req.body;

        // If lastName is missing, reconstruct it from firstName
        let processedLastName = lastName;
        if (!lastName && firstName.includes(" ")) {
            const nameParts = firstName.split(" ");
            firstName = nameParts[0]; // First word as first name
            processedLastName = nameParts.slice(1).join(" "); // Remaining words as last name
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // If user does not exist, create a new one
            user = new User({
                provider,
                providerId,
                email,
                firstName,
                lastName: processedLastName,
                photo
            });
            await user.save();
        } else {
            // Update user details (optional)
            user.firstName = firstName;
            user.lastName = processedLastName;
            user.photo = photo;
            await user.save();
        }

        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        console.error("OAuth Login Error:", error);
        res.status(500).json({ message: "Error during OAuth login", error: error.message });
    }
};
