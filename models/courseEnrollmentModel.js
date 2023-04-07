const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
    // type: { type: String, enum: ['private', 'paid'], required: true },

    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


    // when the user requests a paid course
    enrollmentRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enrollmentRequestedOn: { type: Date },
    requestStatus: { type: String, enum: ['pending', 'approved', 'declined'] },

    // when admin accepts the user request for paid course
    // or when admin un/assign the private course
    isEnrolled: { type: Boolean, default: false },
    enrolledOn: { type: Date },

    progress: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedOn: { type: Date },

    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

module.exports = CourseEnrollment;
