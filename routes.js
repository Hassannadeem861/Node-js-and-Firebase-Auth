// src/routes.js
const express = require('express');
const router = express.Router();
const { admin, db } = require('./firebase');
const { signup, login } = require('./controller');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
