const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const courseController = require('../controllers/courseController');
const verifyToken = require('../providers/jwtMiddleware');
const progressController = require('../controllers/progressController');
const router = express.Router();

router.post('/course/:id/requestEnrollment', verifyToken, courseController.requestCourseEnrollment)
router.get('/course/all', verifyToken, courseController.allCourses)
router.get('/course/:id/details', verifyToken, courseController.getCourseDetails)
router.get('/course/my-courses', verifyToken, courseController.getMyCourses)
router.get('/course/my-course/:id/details', verifyToken, courseController.getMyCourseDetails)
router.post('/course/:id/enrollCourse', verifyToken, courseController.enrollCourse)

router.get('/course/:id/slide/:slideid/details', verifyToken, courseController.getSlideDetails)

router.post('/course/:id/slide/:slideid/markProgress', verifyToken, progressController.markProgress)
router.get('/course/:id/getProgress', verifyToken, progressController.getProgress)




module.exports = router;
