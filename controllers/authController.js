const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendGrid = require('./../providers/sendGrid')
const authController = {
    async register(req, res) {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    async registerUser(req, res) {
        try {
            const { inviteToken } = req.params;

            let user = await User.findOne({ inviteToken, email: req.body.email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid invite token' });
            }
            let reqBody = req.body;
            Object.keys(reqBody).forEach(key => {
                user[key] = reqBody[key]
            })
            user.isSignedUp = true;
            user.isVerified = true;
            user.inviteToken = null;
            user = await user.save();
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
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
            let user = await User.findOne({ email, isActive: true, isDeleted: false });
            if (!user) throw new Error('User not registered');
            if (user.role != 'admin') {
                if (!user.isActive) throw new Error('User account have been deactivated. Please contact the admin.');
                if (!user.isSignedUp) throw new Error('Before you sign in, please complete your profile using the invitation link sent to you on your email address. If not received yet, please contact admin to resent the invite.');
                if (!user.isVerified) throw new Error('Please verify your email before you sign in.');
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
            const existingUser = await User.findOne({ email });
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
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (!user.isSignedUp) {
                return res.status(400).json({ message: 'User is not verified yet.' });
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
            const { password } = req.body;
            const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(200).json({ message: 'Password reset successful' });
        } catch (err) {
            next(err);
        }
    }

};

module.exports = authController;
