const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    readinessAssessment: {
        overallScore: { type: Number, default: null },
        academicScore: { type: Number, default: null },
        extracurricularScore: { type: Number, default: null },
        fitScore: { type: Number, default: null },
        strengths: { type: [String], default: [] },
        weaknesses: { type: [String], default: [] },
        actionableSteps: { type: [String], default: [] },
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
