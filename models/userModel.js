const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true,
        // validate: {
        //     validator: function (value) {
        //         const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        //         return emailRegex.test(value);
        //     },
        //     message: 'Please enter a valid email address',
        // },
    },
    password: {
        type: String,
        required: function () {
            return this.inviteToken === null;
        },
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    firstName: {
        type: String,
        required: function () {
            return this.inviteToken === null;
        },
    },
    lastName: {
        type: String,
        required: function () {
            return this.inviteToken === null;
        },
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    inviteToken: {
        type: String,
        required: function () {
            return this.role === 'user' && this.inviteToken !== null;
        },
    },
    invitedAt: { type: Date, default: Date.now },
    isSignedUp: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
