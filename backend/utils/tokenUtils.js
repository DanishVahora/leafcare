const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, authMethod = 'jwt') => {
  return jwt.sign({ userId, authMethod }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };