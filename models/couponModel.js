const mongoose = require('mongoose');

const courseCouponSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    name: { type: String, required: true, lowercase: true },
    valueType: { type: String, enum: ['free', 'percentage', 'fixed'], default: 'free' },
    value: { type: String, default: null },
    usageLimit: { type: Number, default: null },
    balance: { type: Number, default: null },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


const CourseCoupon = mongoose.model('CourseCoupon', courseCouponSchema);

module.exports = CourseCoupon;
