const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    name: { type: String, default: '' },
    gradeLevel: { type: Number, default: null },
    gpa: { type: Number, default: null },
    testScores: {
        sat: { type: Number, default: null },
        act: { type: Number, default: null },
        toefl: { type: Number, default: null },
    },
    interests: { type: [String], default: [] },
    intendedMajors: { type: [String], default: [] },
    extracurriculars: { type: [String], default: [] },
    awards: { type: [String], default: [] },
    volunteering: { type: [String], default: [] },
    dreamColleges: { type: [String], default: [] },
    aiAnalysis: { type: String, default: '' },
}, { timestamps: true });

profileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
