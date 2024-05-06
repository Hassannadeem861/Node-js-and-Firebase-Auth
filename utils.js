// src/utils.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'hassan nadeem', { expiresIn: '1h' }); // Apne secret key se update karein
};

module.exports = { generateToken };
