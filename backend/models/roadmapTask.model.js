const mongoose = require('mongoose');

const roadmapTaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    date: {
        type: String,
        default: 'TBD',
        trim: true,
    },
    category: {
        type: String,
        enum: ['academic', 'standardized_testing', 'essay', 'application'],
        default: 'application',
    },
}, { timestamps: true });

// Ensure responses expose `id` instead of `_id`
roadmapTaskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const RoadmapTask = mongoose.model('RoadmapTask', roadmapTaskSchema);

module.exports = RoadmapTask;
