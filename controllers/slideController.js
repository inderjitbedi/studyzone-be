const Slide = require("../models/slideModel");
const path = require('path'); const fs = require('fs-extra');

const File = require("../models/fileModel");

const slideController = {

    /*
    
        SLIDES API'S STARTS

    */
    async addSlide(req, res) {
        try {
            let reqBody = req.body;

            if (reqBody.type == 'pdf' || reqBody.type == 'video' || reqBody.type == 'audio') {
                let file = await File.findOne({ _id: reqBody.file });
                const tempFilePath = [file.destination, file.name].join('/')
                const newFilePath = "uploads/course_" + req.params.id + "/slides";
                const newFileName = Date.now() + "_" + file.originalName.replaceAll(' ', '_')
                const destFilePath = [newFilePath, newFileName].join('/');
                if (!fs.existsSync(newFilePath)) {
                    // await fs.mkdirSync("../" + newFilePath, { recursive: true });
                    await fs.mkdirSync(newFilePath, { recursive: true });

                    console.log(`Directory ${path.join(__dirname, "../" + newFilePath)} created successfully`);
                }
                console.log('\n\n temp path = ', path.join(__dirname, "../" + tempFilePath), fs.existsSync(path.join(__dirname, "../" + tempFilePath)),
                    '\n\n dest path = ', path.join(__dirname, "../" + newFilePath), fs.existsSync(path.join(__dirname, "../" + newFilePath)));

                await fs.renameSync(path.join(__dirname, "../" + tempFilePath),
                    path.join(__dirname, "../" + destFilePath));
                file = await File.findOneAndUpdate({ _id: reqBody.file }, {
                    ...file.toObject(),
                    destination: newFilePath,
                    path: destFilePath,
                    name: newFileName
                }, { new: true });
            }

            const slide = new Slide({ ...req.body, course: req.params.id })
            await slide.save();
            const populatedSlide = await Slide.findById(slide._id).populate('file');

            res.status(201).json({ populatedSlide, message: 'Slide added to the course successfully.' });
        } catch (error) {
            console.error("\n\nadminController:addCourse:error -", error);
            res.status(400).json({ message: error.toString() });
        }
    },
    async listSlides(req, res) {
        try {
            const slides = await Slide.find({ course: req.params.id, isDeleted: false }).populate('course', ['name', 'type']).populate('file')
                .sort('position').skip((req.query.pageNumber - 1) * req.query.pageSize).limit(req.query.pageSize)
            const count = await Slide.countDocuments({ course: req.params.id, isDeleted: false });
            const totalPages = Math.ceil(count / req.query.pageSize);

            res.json({ slides, totalPages, currentPage: req.query.pageNumber, message: 'Slides fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:listSlides:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async reorderSlides(req, res) {
        try {
            let slides = req.body.slides
            slides.forEach(async (slide, i) => {
                await Slide.findByIdAndUpdate(slide, { position: i + 1 });
            });
            res.json({ message: 'Slides reordered successfully' });
        } catch (error) {
            console.error("\n\nadminController:reorderSlides:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async getSlideDetails(req, res) {
        try {
            let slide = await Slide.findOne({ _id: req.params.slideid, isDeleted: false }).populate('course', ['name', 'type']).populate('file');
            res.json({ slide, message: 'Slide details fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:getSlideDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async editSlide(req, res) {
        try {
            let slide = await Slide.findOne({ _id: req.params.slideid, isDeleted: false });
            if (!slide) {
                return res.status(400).json({ message: 'Slide not found.' });
            }
            let reqBody = req.body;
            if (slide.file !== reqBody.file) {
                if (reqBody.type == 'pdf' || reqBody.type == 'video' || reqBody.type == 'audio') {

                    let file = await File.findOne({ _id: reqBody.file });

                    const tempFilePath = [file.destination, file.name].join('/')
                    const newFilePath = "uploads/course_" + req.params.id + "/slides";
                    const newFileName = Date.now() + "_" + file.originalName.replaceAll(' ', '_')
                    const destFilePath = [newFilePath, newFileName].join('/');
                    if (!fs.existsSync(newFilePath)) {
                        await fs.mkdirSync("../" + newFilePath, { recursive: true });
                    }
                    console.log('\n\n temp path = ', path.join(__dirname, "../" + tempFilePath), fs.existsSync(path.join(__dirname, "../" + tempFilePath)),
                        '\n\n dest path = ', path.join(__dirname, "../" + destFilePath), fs.existsSync(path.join(__dirname, "../" + destFilePath)));


                    await fs.renameSync(path.join(__dirname, "../" + tempFilePath),
                        path.join(__dirname, "../" + destFilePath));
                    file = await File.findOneAndUpdate({ _id: reqBody.file }, {
                        ...file.toObject(),
                        destination: newFilePath,
                        path: destFilePath,
                        name: newFileName
                    }, { new: true });
                }
            }


            slide = await Slide.findByIdAndUpdate(req.params.slideid, req.body, { new: true })
            res.json({ slide, message: 'Slide details updated successfully' });

        } catch (error) {
            console.error("\n\nadminController:editSlide:error -", error.toString());
            res.status(400).json({ message: error.toString() });;

        }
    },

}
module.exports = slideController