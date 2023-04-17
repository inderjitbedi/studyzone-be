const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    slide: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Progress = mongoose.model('Progress', ProgressSchema);

module.exports = Progress