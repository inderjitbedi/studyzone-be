const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment
// async function getCommentThread(commentIds) {
//   const comments = await CommentModel.find({ _id: { $in: commentIds } })
//     .populate('author', 'username')
//     .lean();

//   const commentMap = comments.reduce((map, comment) => {
//     map[comment._id] = comment;
//     return map;
//   }, {});

//   const roots = comments.filter(comment => !comment.parent);
//   return roots.map(root => buildCommentThread(root));

//   function buildCommentThread(comment) {
//     const children = comment.children.map(childId => buildCommentThread(commentMap[childId]));
//     comment.children = children;
//     return comment;
//   }
// }