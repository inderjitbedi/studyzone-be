const User = require("../models/userModel");
const sendGrid = require("../providers/sendGrid");

const adminController = {
    async inviteUser(req, res) {
        try {
            const { email } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Generate invite token
            const token = Math.random().toString(36).substr(2, 8);

            // Create new user
            const user = new User({ email, token });
            await user.save();

            sendGrid.send(email, 'inviteUser', { req, token, email })

            res.json({ message: 'User invited successfully' });
        } catch (error) {
            console.error("\n\nadminController:inviteUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    }, async checkEmailUniqueness(req, res) {
        try {
            const { email } = req.params;
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            // if (existingUser) {
            //     return res.status(409).json({ isUnique: !existingUser, message: 'User already exists' });
            // }
            res.json({ isUnique: !existingUser });
        } catch (error) {
            console.error("\n\nadminController:inviteUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async reinviteUser(req, res) {
        try {
            const { _id, email } = req.body;

            // Check if user already exists
            const existingUser = await User.findById({ _id });

            if (existingUser && existingUser.isSignedUp) {
                return res.status(400).json({ message: 'User has already signed up successfully.' });
            }

            // Generate invite token
            const token = Math.random().toString(36).substr(2, 8);
            existingUser.invitedAt = Date.now()
            existingUser.inviteToken = token;
            existingUser.email = email
            await existingUser.save();

            await sendGrid.send(email, 'inviteUser', { req, token, email })

            res.json({ message: 'User reinvited successfully' });
        } catch (error) {

            console.error("\n\nadminController:reinviteUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async manageUserAccess(req, res) {
        try {
            const { email } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({ message: 'User not found.' });
            }
            if (req.body.isDeleted != null || req.body.isDeleted != undefined) {
                existingUser.isDeleted = req.body.isDeleted;
            }
            if (req.body.isActive != null || req.body.isActive != undefined) {
                existingUser.isActive = req.body.isActive;
            }
            await existingUser.save();

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            console.error("\n\nadminController:manegeUserAccess:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async listUsers(req, res) {
        try {
            let searchCriteria = {}

            if (req.query.search) {
                searchCriteria = {
                    $or: [
                        { email: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
                        { fullName: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
                    ]
                }
            }
            const users = await User.find({
                isDeleted: false,
                role: 'user',
                ...searchCriteria
            },);

            res.json({ users, message: 'Users fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:manegeUserAccess:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async getUserDetails(req, res) {
        try {

            // Check if user already exists
            const user = await User.findOne({ _id: req.params.id, isDeleted: false });

            if (!user) {
                return res.status(400).json({ message: 'User not found.' });
            }

            res.json({ user, message: 'User details fetched successfully' });
        } catch (error) {

            console.error("\n\nadminController:reinviteUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async updateUser(req, res) {
        try {
            const existingUser = await User.findOne({ _id: req.params.id, isDeleted: false });
            if (!existingUser) {
                return res.status(400).json({ message: 'User not found.' });
            }
            // if (existingUser.email !== req.body.email) {
            //     this.reinviteUser(req, res)
            // }
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

            res.json({ user, message: 'User details updated successfully' });
        } catch (error) {

            console.error("\n\nadminController:updateUser:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },


}

module.exports = adminController