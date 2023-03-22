const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    destination: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number, },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
