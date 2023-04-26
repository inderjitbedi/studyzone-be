const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const makeExpressCallback = require('./../providers/expressCallback')

router.post('/login', authController.login);
// router.post('/register', authController.register);
router.put('/complete-signup/:inviteToken', authController.registerUser)
router.get('/check-uniqueness-email/:email', authController.checkEmailUniqueness)

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
