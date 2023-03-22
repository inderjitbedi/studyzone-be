const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const verifyToken = require('../providers/jwtMiddleware');
const router = express.Router();



module.exports = router;
