const express = require('express');
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const fileController = require('../controllers/fileController');
const slideController = require('../controllers/slideController');
const verifyToken = require('../providers/jwtMiddleware');
const upload = require('../providers/uploadFile');
const progressController = require('../controllers/progressController');
const couponController = require('../controllers/couponController');
const router = express.Router();


router.post('/invite-user', verifyToken, adminController.inviteUser)
router.get('/check-uniqueness-email/:email', verifyToken, adminController.checkEmailUniqueness)
router.post('/reinvite-user', verifyToken, adminController.reinviteUser)
router.put('/manage-user-access', verifyToken, adminController.manageUserAccess)

router.get('/user/list', verifyToken, adminController.listUsers)
router.get('/user/:id', verifyToken, adminController.getUserDetails)
router.put('/user/:id', verifyToken, adminController.updateUser)

router.get('/course/list/:type', verifyToken, courseController.listCourses)
router.get('/course/all', verifyToken, courseController.listAll)
router.post('/course', verifyToken, courseController.addCourse)
router.put('/course/:id', verifyToken, courseController.editCourse)
router.get('/course/:id', verifyToken, courseController.getCourseDetails)
router.put('/course/:id/delete', verifyToken, courseController.deleteCourse)
router.put('/course/manage-visibility/:id', verifyToken, courseController.editCourse)


router.get('/coupon/list/:type', verifyToken, couponController.list)
router.post('/coupon', verifyToken, couponController.add)
router.put('/coupon/:couponid', verifyToken, couponController.edit)
router.get('/coupon/:couponid', verifyToken, couponController.details)
router.put('/coupon/:couponid/delete', verifyToken, couponController.delete)
// router.put('/coupon/manage-visibility/:id', verifyToken, couponController.editCourse)


router.get('/course/:id/comment', verifyToken, courseController.getComments)
router.post('/course/:id/comment', verifyToken, courseController.addComment)
router.put('/course/:id/comment/:commentid', verifyToken, courseController.deleteComment)


router.get('/course/:id/slide/list', verifyToken, slideController.listSlides)
router.get('/course/:id/slide/:slideid', verifyToken, slideController.getSlideDetails)
router.put('/course/:id/slide/list/reorder', verifyToken, slideController.reorderSlides)
router.put('/course/:id/slide/:slideid', verifyToken, slideController.editSlide)
router.post('/course/:id/slide', verifyToken, slideController.addSlide)

router.post('/course/:id/enrollUser', verifyToken, courseController.enrollUser)
router.get('/course/:id/getEnrollments', verifyToken, courseController.getCourseEnrollment)
router.get('/course/:id/getUsersToEnroll', verifyToken, courseController.getUsersToEnroll)
router.get('/course/:id/getEnrollmentRequests', verifyToken, courseController.getEnrollmentRequests)
router.put('/course/:id/manageEnrollment/:enrollmentId', verifyToken, courseController.manageCourseEnrollment)
router.put('/course/:id/manageEnrollmentRequest/:enrollmentId', verifyToken, courseController.manageCourseEnrollmentRequest)

router.post('/file/upload/:type', verifyToken, upload.single('file'), fileController.upload);

router.get('/analytics/list/:type', courseController.getAnalytics)

router.get('/transaction/list', verifyToken, couponController.getTransactions)

module.exports = router;
