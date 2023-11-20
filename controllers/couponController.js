const CourseCoupon = require("../models/couponModel");
const Course = require("../models/courseModel");

const couponController = {


    async add(req, res) {
        try {
            let reqBody = req.body;
            const coupon = new CourseCoupon({ ...reqBody, course: req.params.id })
            await coupon.save();
            const populatedCoupon = await coupon.populate('course');

            res.status(201).json({ populatedCoupon, message: 'Coupon added to the course successfully.' });
        } catch (error) {
            console.error("\n\nadminController:addCourse:error -", error);
            res.status(400).json({ message: error.toString() });
        }
    },
    async list(req, res) {
        try {
            const page = parseInt(req.query.pageNumber) || 1;
            const limit = parseInt(req.query.pageSize) || 9999;
            const startIndex = (page - 1) * limit;
            // let filters = { course: req.params.id, isDeleted: false }
            // const coupons = await CourseCoupon.find(filters)
            //     .populate('course', ['name', 'type'])
            //     .sort({ 'createdAt': -1 })
            //     .skip((req.query.pageNumber - 1) * req.query.pageSize)
            //     .limit(req.query.pageSize)

            const pipeline = [
                {
                    $match: {
                        type: req.params.type,
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'coursecoupons', // Assuming the collection name is 'coursecoupons'
                        localField: '_id',
                        foreignField: 'course',
                        as: 'coupons'
                    }
                },
                {
                    $unwind: '$coupons'
                },
                {
                    $match: {
                        'coupons.isDeleted': false,
                    }
                },
                {
                    $sort: { 'coupons.createdAt': -1 }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ];

            const result = await Course.aggregate(pipeline);


            const countResult = await Course.aggregate([
                {
                    $match: {
                        type: req.params.type,
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'coursecoupons', // Assuming the collection name is 'coursecoupons'
                        localField: '_id',
                        foreignField: 'course',
                        as: 'coupons'
                    }
                },
                {
                    $unwind: '$coupons'
                },
                {
                    $match: {
                        'coupons.isDeleted': false,
                    }
                },]);

            const coupons = result.length > 0 ? result[0].coupons : [];
            const totalCoupons = countResult.length > 0 ? countResult[0].coupons.length : 0;
            const totalPages = Math.ceil(totalCoupons / limit);

            res.json({
                coupons,
                totalPages,
                totalCoupons,
                currentPage: page,
                message: 'Coupons fetched successfully'
            });
        } catch (error) {
            console.error("\n\nadminController:listCoupons:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    // async reorderCoupons(req, res) {
    //     try {
    //         let coupons = req.body.coupons
    //         coupons.forEach(async (coupon, i) => {
    //             await CourseCoupon.findByIdAndUpdate(coupon, { position: i + 1 });
    //         });
    //         res.json({ message: 'Coupons reordered successfully' });
    //     } catch (error) {
    //         console.error("\n\nadminController:reorderCoupons:error -", error);
    //         res.status(400).json({ message: error.toString() });;
    //     }
    // },
    async details(req, res) {
        try {
            let coupon = await CourseCoupon.findOne({ _id: req.params.couponid, isDeleted: false }).populate('course', ['name', 'type']);
            res.json({ coupon, message: 'Coupon details fetched successfully' });
        } catch (error) {
            console.error("\n\nadminController:getCouponDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async edit(req, res) {
        try {
            let coupon = await CourseCoupon.findOne({ _id: req.params.couponid, isDeleted: false });
            if (!coupon) {
                return res.status(400).json({ message: 'Coupon not found.' });
            }
            let reqBody = req.body;

            coupon = await CourseCoupon.findByIdAndUpdate(req.params.couponid, reqBody, { new: true })
            res.json({ coupon, message: 'Coupon details updated successfully' });
        } catch (error) {
            console.error("\n\nadminController:editCoupon:error -", error.toString());
            res.status(400).json({ message: error.toString() });;

        }
    },
    async delete(req, res) {
        try {

            let coupon = await CourseCoupon.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true })

            res.json({ coupon, message: 'Coupon deleted successfully' });
        } catch (error) {
            console.error("\n\nadminController:editCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

}
module.exports = couponController