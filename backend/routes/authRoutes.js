const express = require('express');
const { signup, login } = require('../controllers/authController'); // Import controllers
const { oauthLogin } = require('../controllers/OauthController');
 const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/oauth/login', oauthLogin);


module.exports = router;
