const mongoose = require('mongoose');

const readinessAssessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    overallScore: { type: Number, default: null },
    academicScore: { type: Number, default: null },
    extracurricularScore: { type: Number, default: null },
    fitScore: { type: Number, default: null },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    actionableSteps: { type: [String], default: [] },
}, { timestamps: true });

readinessAssessmentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const ReadinessAssessment = mongoose.model('ReadinessAssessment', readinessAssessmentSchema);

module.exports = ReadinessAssessment;
