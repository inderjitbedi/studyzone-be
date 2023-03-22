const express = require('express');
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const fileController = require('../controllers/fileController');
const slideController = require('../controllers/slideController');
const verifyToken = require('../providers/jwtMiddleware');
const upload = require('../providers/uploadFile');
const router = express.Router();


router.post('/invite-user', verifyToken, adminController.inviteUser)
router.get('/check-uniqueness-email/:email', verifyToken, adminController.checkEmailUniqueness)
router.post('/reinvite-user', verifyToken, adminController.reinviteUser)
router.put('/manage-user-access', verifyToken, adminController.manageUserAccess)

router.get('/user/list', verifyToken, adminController.listUsers)
router.get('/user/:id', verifyToken, adminController.getUserDetails)
router.put('/user/:id', verifyToken, adminController.updateUser)

router.get('/course/list/:type', verifyToken, courseController.listCourses)
router.post('/course', verifyToken, courseController.addCourse)
router.put('/course/:id', verifyToken, courseController.editCourse)
router.get('/course/:id', verifyToken, courseController.getCourseDetails)
router.put('/course/manage-visibility/:id', verifyToken, courseController.editCourse)


// router.get('/course/:id/comment/list', verifyToken, courseController.editCourse)
router.post('/course/:id/comment', verifyToken, courseController.addComment)
router.put('/course/:id/comment/:commentid', verifyToken, courseController.deleteComment)


router.get('/course/:id/slide/list', verifyToken, slideController.listSlides)
router.get('/course/:id/slide/:slideid', verifyToken, slideController.getSlideDetails)
router.put('/course/:id/slide/list/reorder', verifyToken, slideController.reorderSlides)

router.put('/course/:id/slide/:slideid', verifyToken, slideController.editSlide)
router.post('/course/:id/slide', verifyToken, slideController.addSlide)

// router.post('/file/upload/:type', verifyToken, fileController.upload)

router.post('/file/upload/:type',verifyToken, upload.single('file'), fileController.upload);
module.exports = router;
