const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['STUDENT', 'ADMIN'],
        default: 'STUDENT'
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;