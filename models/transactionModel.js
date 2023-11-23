const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCoupon', default: null },
    stripePaymentId: { type: String },
    stripePaymentMethodId: { type: String },
    amount: { type: Number, default: null },
    status: { type: String },
    email: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


const Transaction = mongoose.model('Transaction', schema);

module.exports = Transaction;
