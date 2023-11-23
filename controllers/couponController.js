const CourseCoupon = require("../models/couponModel");
const CourseEnrollment = require("../models/courseEnrollmentModel");
const Transaction = require("../models/transactionModel");
const stripe = require('stripe')('sk_test_51OCYMFI5NMkvPoS4D38p4nASIkjgjU4CaPDCrQyKoUwSncqPNGef0nfJNR0B1cwMkQvyh2gW0f7oocg1uwCalZuN00bexnzlJP');

const couponController = {


    async add(req, res) {
        try {
            let reqBody = req.body;
            const coupon = new CourseCoupon({ ...reqBody })
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
            let filters = { isDeleted: false }
            const coupons = await CourseCoupon.find(filters)
                .populate('course', ['name', 'type'])
                .sort({ 'createdAt': -1 })
                .skip(startIndex)
                .limit(limit)


            const totalCoupons = await CourseCoupon.countDocuments({ isDeleted: false });
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
            let coupon = await CourseCoupon.findByIdAndUpdate(req.params.couponid, { isDeleted: true }, { new: true })
            res.json({ coupon, message: 'Coupon deleted successfully' });
        } catch (error) {
            console.error("\n\nadminController:editCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async validate(req, res) {
        try {
            let coupon = await CourseCoupon.findOne({ course: req.params.id, name: req.params.promo, status: true, isDeleted: false }).populate('course', ['name', 'price']);

            console.log(req.params, coupon);
            if (!coupon) {
                res.status(400).json({ message: 'Invalid coupon' });
            } else
                if (coupon.usageLimit > 0 && coupon.usageLimit === coupon.usageCounter) {
                    res.status(400).json({ message: 'Coupon is expired' });
                } else {
                    let coursePrice = coupon.course.price
                    let couponValue = 0
                    if (coupon.valueType === 'percentage') {
                        couponValue = coursePrice * (coupon.value / 100)
                    } else if (coupon.valueType === 'fixed') {
                        couponValue = coupon.value
                    } else if (coupon.valueType === 'free') {
                        couponValue = coursePrice
                    }
                    let finalPrice = coursePrice - couponValue;
                    if (finalPrice < 0) {
                        finalPrice = 0
                    }
                    res.json({ valid: true, finalPrice, couponValue, coupon: coupon._id, message: 'Coupon is valid' });
                }


        } catch (error) {
            console.error("\n\nadminController:getCouponDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
    async paymentIntent(req, res) {
        try {
            const { amount } = req.body;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // amount in cents
                currency: 'cad',
            });

            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error("\n\nadminController:editCourse:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async addTransaction(req, res) {
        try {
            let reqBody = req.body;
            console.log("reqBody = ", reqBody);
            reqBody.user = req.user._id
            const transaction = new Transaction({ ...reqBody })
            await transaction.save();
            // console.log("transaction = ", transaction);
            if (transaction.status === 'succeeded') {
                let coupon = await CourseCoupon.findOne({ _id: req.body.coupon })
                console.log("coupon = ", coupon);

                if (coupon) {
                    console.log("coupon usageCounter= ", coupon.usageCounter);
                    coupon.usageCounter = (coupon.usageCounter || 0) + 1;
                    console.log("coupon usageCounter after = ", coupon.usageCounter);
                    await coupon.save();
                    coupon = await CourseCoupon.findOne({ coupon: req.body.couponid })
                    console.log("coupon after update = ", coupon);
                }


                let filters = {
                    course: reqBody.course,
                    user: req.user._id
                }
                let enrollment = await CourseEnrollment.findOne(filters)
                //enrollmentRequestedBy
                // enrollmentRequestedOn
                let body = {
                    course: reqBody.course,
                    user: req.user._id,
                    isEnrolled: true,
                    enrolledOn: new Date(),
                    requestStatus: 'payment_received'
                }
                if (!enrollment)
                    enrollment = await CourseEnrollment.create(body);
                else
                    enrollment = await CourseEnrollment.findOneAndUpdate(filters, body, { new: true });

                console.log("saved", enrollment);
            }

            res.status(201).json({ message: 'Transaction saved successfully.' });

        } catch (error) {
            console.error("\n\nadminController:getCouponDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },

    async getTransactions(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            let transactions = await Transaction.find({ isDeleted: false })
                .populate('course', ['name'])
                .populate('coupon', ['name'])
                .populate('user', ['fullName', 'email'])
                .skip(startIndex)
                .limit(limit).sort({ createdAt: -1 });
            const totalTransactions = await Transaction.countDocuments({ isDeleted: false });
            res.json({ transactions, totalTransactions, page, message: 'Transactions fetched successfully' })

        } catch (error) {
            console.error("\n\nadminController:getCouponDetails:error -", error);
            res.status(400).json({ message: error.toString() });;
        }
    },
}
module.exports = couponController