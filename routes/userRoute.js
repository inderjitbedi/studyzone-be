const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const courseController = require('../controllers/courseController');
const verifyToken = require('../providers/jwtMiddleware');
const router = express.Router();

router.post('/course/:id/requestEnrollment', verifyToken, courseController.requestCourseEnrollment)


module.exports = router;
