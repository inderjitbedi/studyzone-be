const Comment = require("../models/commentModel");
const Course = require("../models/courseModel");
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
    async getCommentThread(commentIds) {
        const comments = await CommentModel.find({ _id: { $in: commentIds } })
            .populate('author', ['firstName', 'lastName'])
            .lean();

        const commentMap = comments.reduce((map, comment) => {
            map[comment._id] = comment;
            return map;
        }, {});

        const roots = comments.filter(comment => !comment.parent);
        return roots.map(root => buildCommentThread(root));

        function buildCommentThread(comment) {
            const children = comment.children.map(childId => buildCommentThread(commentMap[childId]));
            comment.children = children;
            return comment;
        }
    },
}
module.exports = courseController