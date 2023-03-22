const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ['text', 'video', 'audio', 'pdf'], default: 'text' },
    position: { type: Number, required: true },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    text: {
        type: String,
        required: function () {
            return this.type === 'text';
        }
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: function () {
            return this.type !== 'text';
        }
    },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const Slide = mongoose.model('Slide', slideSchema);

module.exports = Slide;
