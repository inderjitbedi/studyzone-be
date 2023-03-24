const mongoose = require('mongoose');
const CommentModel = require('./commentModel');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ['public', 'private', 'paid'], default: 'public' },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    rootComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

courseSchema.statics.addComment = async function (commentData) {
    const { course, parent } = commentData;

    const comment = new CommentModel(commentData);
    await comment.save();

    if (parent) {
        const parentComment = await CommentModel.findById(parent);
        if (parentComment) {
            parentComment.children.push(comment._id);
            await parentComment.save();
        }
    } else {
        const courseDetail = await this.findById(course);
        courseDetail.rootComments.push(comment._id);
        await courseDetail.save();
    }
    return comment;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
