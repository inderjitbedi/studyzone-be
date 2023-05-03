const User = require("../models/userModel");


const userController = {
    async changePassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const user = await User.findOne({ _id: req.user._id });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid current password' });
            }
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error("\n\nuserController:changePassword:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async updateProfile(req, res) {
        try {
            const { fullName } = req.body;
            const user = await User.findOneAndUpdate({ _id: req.user._id }, { fullName }, { new: true });
            // user.fullName = fullName;
            // await user.save();
            res.status(200).json({ user, message: 'Profile updated successfully' });
        } catch (error) {
            console.error("\n\nuserController:changePassword:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
}

module.exports = userController