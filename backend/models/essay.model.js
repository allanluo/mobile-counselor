const mongoose = require('mongoose');

const essaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    collegeName: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    lastEdited: { type: Date, default: Date.now },
    aiFeedback: { type: String, default: '' },
}, { timestamps: true });

essaySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Essay = mongoose.model('Essay', essaySchema);

module.exports = Essay;
