const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendGrid = require('./../providers/sendGrid')
const authController = {
    async register(req, res) {
        try {
            user = await User.findOne({ email: req.body.email, isDeleted: false });
            if (user) {
                return res.status(400).json({ message: 'Email already registered.' });
            }
            user = new User({ ...req.body, isSignedUp: true, isVerified: false, isActive: false });
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    },
    async registerUser(req, res) {
        try {
            let { token } = req.params;

            let user = await User.findOne({ email: req.body.email, isDeleted: false });
            console.log(user);
            if (!user) {
                return res.status(400).json({ message: 'No invitation found for this email.' });
            }
            user = await User.findOne({ inviteToken: token, email: req.body.email, isDeleted: false });
            if (!user) {
                return res.status(400).json({ message: 'Invalid invititation token.' });
            }
            let reqBody = req.body;
            Object.keys(reqBody).forEach(key => {
                user[key] = reqBody[key]
            })
            user.isSignedUp = true;
            user.isVerified = true;
            // user.inviteToken = null;
            user = await user.save();
            token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
            user = user.toObject();
            delete user.password;
            res.json({ user, token, message: 'User signed up successfully' });
        } catch (error) {
            console.error("\n\nauthController:registerUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email, isDeleted: false });
            if (!user) throw new Error('No matching user found. Please register for portal access.');
            if (user.role != 'admin') {
                if (!user.isSignedUp) throw new Error('Before you sign in, please complete your profile using the invitation link sent to you on your email address. If not received yet, please contact admin to resent the invite.');
                if (!user.isVerified) throw new Error('Admin verification pending. You will be notified once the account is approved.');
                if (!user.isActive) throw new Error('User account have been deactivated. Please contact the admin.');

            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) throw new Error('Invalid credentials');
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            user = user.toObject();
            delete user.password
            res.json({ user, token, message: 'User signed in successfully' });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },
    async checkEmailUniqueness(req, res) {
        try {
            const { email } = req.params;
            // Check if user already exists
            const existingUser = await User.findOne({ email, isDeleted: false });
            // if (existingUser) {
            //     return res.status(409).json({ isUnique: !existingUser, message: 'User already exists' });
            // }
            res.json({ isUnique: !existingUser });
        } catch (error) {
            console.error("\n\nauthController:checkEmailUniqueness:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email, isDeleted: false });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (!user.isSignedUp) {
                return res.status(400).json({ message: 'User is not signed up yet.' });
            }
            if (!user.isVerified) {
                return res.status(400).json({ message: 'Admin verification pending. You will be notified once the account is approved.' });
            }
            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + (3600000 * 24); // 24 hour
            await user.save();

            sendGrid.send(user.email, 'forgotPassword', { req, token });
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (err) {
            next(err);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { password, newPassword } = req.body;
            const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid current password' });
            }
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (err) {
            next(err);
        }
    },


};

module.exports = authController;
