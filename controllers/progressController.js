const Progress = require("../models/progressModel");
const Slide = require("../models/slideModel");


const progressController = {
    async getProgress(req, res) {
        try {
            let progress = await Progress.find({
                course: req.params.id,
                user: req.user._id,
                isDeleted: false
            }).populate('slide').sort({"updatedAt":-1});

            let totalSlides = await Slide.countDocuments({ course: req.params.id, isDeleted: false })
            let completedSlides = await Progress.countDocuments({ course: req.params.id, user: req.user._id, isCompleted: true })
            const percentComplete = Math.round(completedSlides / totalSlides * 100);
            res.json({ progress, percentComplete, message: 'Progress fetched successfully' });
        } catch (error) {
            console.error("\n\nprogressController:getProgress:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async markProgress(req, res) {
        try {
            let body = {
                course: req.params.id,
                slide: req.params.slideid,
                user: req.user._id,
                updatedAt: new Date(),
                ...req.body
            }
            if (req.body.isCompleted) {
                body.completedAt = new Date()
            }
            let progress = await Progress.findOneAndUpdate(
                {
                    course: req.params.id,
                    slide: req.params.slideid,
                    user: req.user._id,
                    isDeleted: false
                }, body,
                { upsert: true, new: true });
            res.json({ progress, message: 'Progress marked successfully' });
        } catch (error) {
            console.error("\n\nprogressController:markProgress:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
}

module.exports = progressController