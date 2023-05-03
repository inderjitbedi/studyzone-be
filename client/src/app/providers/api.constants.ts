export const apiConstants = {

    
// prod ----------
    signin: 'auth/login',
    user: 'admin/user/list',
    inviteUser: 'admin/invite-user',
    reinviteUser: 'admin/reinvite-user',
    manageUserAccess: 'admin/manage-user-access',
    checkEmailUniqueness: 'admin/check-uniqueness-email/',

    course: 'admin/course/list/',
    createCourse: 'admin/course',
    getCourseDetails: 'admin/course/',
    updateCourse: 'admin/course/',
    deleteCourse: 'admin/course/:id/delete',
    manageCourseAccess: 'admin/course/manage-visibility/',
    checkCourseUniqueness: 'admin/check-uniqueness-course/',
    addComment: 'admin/course/:id/comment',
    deleteComment: 'admin/course/:id/comment/:commentId',
    manageEnrollmentRequest:'admin/course/:id/manageEnrollmentRequest/:enrollmentId',
    manageEnrollment:'admin/course/:id/manageEnrollment/:enrollmentId',

    slide: 'admin/course/:id/slide/list',
    createSlide: 'admin/course/:id/slide',
    updateSlide: 'admin/course/:id/slide/:slideid',
    getSlideDetails: 'admin/course/:id/slide/:slideid',
    reorderSildes: 'admin/course/:id/slide/list/reorder',
    manageSlideAccess: 'admin/course/manage-visibility/',
    checkSlideUniqueness: 'admin/check-uniqueness-course/',

    uploadFile: 'admin/file/upload/',

    courseEnrollment: 'admin/course/:id/enrollUser',
    getEnrollments: 'admin/course/:id/getEnrollments',
    getEnrollmentRequests: 'admin/course/:id/getEnrollmentRequests',
    getUsersToEnroll:'admin/course/:id/getUsersToEnroll',

    analytics:'admin/analytics/list/:type'
};


