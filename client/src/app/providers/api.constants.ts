export const apiConstants = {
    signin: 'api/auth/login',
    user: 'api/admin/user/list',
    inviteUser: 'api/admin/invite-user',
    reinviteUser: 'api/admin/reinvite-user',
    manageUserAccess: 'api/admin/manage-user-access',
    checkEmailUniqueness: 'api/admin/check-uniqueness-email/',

    course: 'api/admin/course/list/',
    createCourse: 'api/admin/course',
    getCourseDetails: 'api/admin/course/',
    updateCourse: 'api/admin/course/',
    deleteCourse: 'api/admin/course/:id/delete',
    manageCourseAccess: 'api/admin/course/manage-visibility/',
    checkCourseUniqueness: 'api/admin/check-uniqueness-course/',
    addComment: 'api/admin/course/:id/comment',
    deleteComment: 'api/admin/course/:id/comment/:commentId',

    slide: 'api/admin/course/:id/slide/list',
    createSlide: 'api/admin/course/:id/slide',
    updateSlide: 'api/admin/course/:id/slide/:slideid',
    getSlideDetails: 'api/admin/course/:id/slide/:slideid',
    reorderSildes: 'api/admin/course/:id/slide/list/reorder',
    manageSlideAccess: 'api/admin/course/manage-visibility/',
    checkSlideUniqueness: 'api/admin/check-uniqueness-course/',

    uploadFile: 'api/admin/file/upload/',

    courseEnrollment: 'api/admin/course/:id/enrollUser',
    getEnrollments: 'api/admin/course/:id/getEnrollments',
    getEnrollmentRequests: 'api/admin/course/:id/getEnrollmentRequests',
    getUsersToEnroll:'api/admin/course/:id/getUsersToEnroll'
};


