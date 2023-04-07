const Comment = require("../models/commentModel");
const CourseEnrollment = require("../models/courseEnrollmentModel");
const Course = require("../models/courseModel");
const Slide = require("../models/slideModel");
const User = require("../models/userModel");
const courseController = {
    /*
  
      COURSES API'S STARTS

  */
    async addCourse(req, res) {
        try {
            const course = new Course(req.body);
            await course.save();
            res.status(201).json({ course, message: 'Course created successfully' });
        } catch (error) {
            console.error("\n\nadminController:addCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async editCourse(req, res) {
        try {
            let course = await Course.findOne({ _id: req.params.id, isDeleted: false });
            if (!course) {
                return res.status(400).json({ message: 'Course not found.' });
            }
            course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json({ course, message: 'Course details updated successfully' });
        } catch (error) {
            console.error("\n\nadminController:editCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async deleteCourse(req, res) {
        try {
            // let course = await Course.findOne({ _id: req.params.id, isDeleted: false });
            // if (!course) {
            //     return res.status(400).json({ message: 'Course not found.' });
            // }
            let course = await Course.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true })
            let slides = await Slide.updateMany({ course: req.params.id }, { isDeleted: true }, { new: true })


            res.json({ course, message: 'Course deleted successfully' });
        } catch (error) {
            console.error("\n\nadminController:editCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async listCourses(req, res) {
        try {
            const courses = await Course.find({ type: req.params.type, isDeleted: false }).populate(['rootComments', 'rootComments.author']);
            res.json({ courses, message: 'List of ' + req.params.type + ' courses fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:listCourses:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async getCourseDetails(req, res) {
        try {
            let course = await Course.findOne({ _id: req.params.id, isDeleted: false }).populate({
                path: 'rootComments',
                populate: [
                    {
                        path: 'author',
                        select: ['firstName', 'lastName']
                    },
                    {
                        path: 'children',
                        match: {
                            isDeleted: false,

                        }, populate: {
                            path: 'author',
                            select: ['firstName', 'lastName']
                        }
                    }],
                match: { isDeleted: false }
            });

            res.json({ course, message: 'Course details fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:getCourseDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async getCourseEnrollment(req, res) {
        try {
            const enrollment = await CourseEnrollment({
                ...req.body, course: req.params.id,
                enrolledOn: new Date(),
            });
            await enrollment.save();
            res.json({ enrollment, message: 'Course enrolled successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },



    async addComment(req, res) {
        try {
            let comment = await Course.addComment({ course: req.params.id, author: req.user._id, ...req.body });
            res.json({ comment, message: 'Comment added successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async deleteComment(req, res) {
        try {
            const comment = await Comment.findById(req.params.commentid);
            for (const childCommentId of comment.children) {
                await deleteComment(childCommentId);
            }
            comment.isDeleted = true;
            await comment.save();
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error("\n\nadminController:deleteComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    // async getCommentThread(commentIds) {
    //     const comments = await CommentModel.find({ _id: { $in: commentIds } })
    //         .populate('author', ['firstName', 'lastName'])
    //         .lean();

    //     const commentMap = comments.reduce((map, comment) => {
    //         map[comment._id] = comment;
    //         return map;
    //     }, {});

    //     const roots = comments.filter(comment => !comment.parent);
    //     return roots.map(root => buildCommentThread(root));

    //     function buildCommentThread(comment) {
    //         const children = comment.children.map(childId => buildCommentThread(commentMap[childId]));
    //         comment.children = children;
    //         return comment;
    //     }
    // },

    // for admin
    async getCourseEnrollment(req, res) {
        try {
            req.params.id
            const course = await Course.findById(req.params.id)
            let filters = {
                course: req.params.id,
                isDeleted: false,

                // enrollmentRequestedBy: null
            }
            if (course.type === 'paid')
                filters.requestStatus = 'approved'

            const enrollments = await CourseEnrollment.find(filters).populate({
                path: 'user',
                select: ['firstName', 'lastName', 'email']
            }).populate({
                path: 'course',
                select: ['name', 'type']
            });

            res.json({ enrollments, message: 'Enrollments fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async getUsersToEnroll(req, res) {
        try {
            const users = await User.aggregate([
                {
                    $match: {
                        _id: {
                            $nin: await CourseEnrollment.distinct("user", { course: req.params.id })
                        },
                        role: "user"
                    }
                },
                {
                    $lookup: {
                        from: "courseEnrollment",
                        localField: "_id",
                        foreignField: "user",
                        as: "enrollments"
                    }
                },
                {
                    $match: {
                        "enrollments": { $size: 0 }
                    }
                },
                {
                    $match: {
                        $or: [
                            { firstName: { $regex: req.query.search || '', $options: "i" } },
                            { lastName: { $regex: req.query.search || '', $options: "i" } },
                            { email: { $regex: req.query.search || '', $options: "i" } }
                        ]
                    }
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1
                    }
                }
            ])
            res.json({ users, message: 'Users to enroll fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async enrollUser(req, res) {
        try {

            const user = await User.findOne({ email: req.body.user })

            const enrollment = await CourseEnrollment({
                user: user._id,
                course: req.params.id,
                isEnrolled: true,
                enrolledOn: new Date(),
                type: "private",
            });
            await enrollment.save();
            res.json({ enrollment, message: 'Course enrolled successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async getEnrollmentRequests(req, res) {
        try {

            const enrollmentRequests = await CourseEnrollment.find({
                course: req.params.id,
                isDeleted: false,
                enrollmentRequestedBy: { $ne: null },
                isEnrolled: false,
                requestStatus: 'pending'
            }).populate({
                path: 'user',
                select: ['firstName', 'lastName', 'email']
            }).populate({
                path: 'course',
                select: ['name', 'type']
            }).populate({
                path: 'enrollmentRequestedBy',
                select: ['firstName', 'lastName', 'email']
            });


            res.json({ enrollmentRequests, message: 'Enrollment requests fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },


    // for paid courses requested by user
    async manageCourseEnrollmentRequest(req, res) {
        try {
            let body = {
                course: req.params.id,
                isEnrolled: req.body.isEnrolled
            }
            if (body.isEnrolled) body.enrolledOn = new Date();

            const enrollment = await CourseEnrollment.findByIdAndUpdate(
                { _id: req.params.enrollmentId }, body, { upsert: true });

            await enrollment.save();
            res.json({ enrollment, message: `Course ${body.isEnrolled ? 'en' : 'dis'}rolled successfully` });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    // user requesting a paid course
    async requestCourseEnrollment(req, res) {
        try {
            const enrollment = await CourseEnrollment({
                // ...req.body,
                course: req.params.id,
                enrollmentRequestedBy: req.user._id,
                enrollmentRequestedOn: new Date(),
                isEnrolled: false,
                requestStatus: 'pending'
            });
            await enrollment.save();
            res.json({ enrollment, message: 'Course enrolled successfully' });
        } catch (error) {
            console.error("\n\nadminController:addComment:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

}
module.exports = courseController