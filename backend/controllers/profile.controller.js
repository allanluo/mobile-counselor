const Profile = require('../models/profile.model');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        res.status(200).json(profile ? profile.toJSON() : null);
    } catch (error) {
        console.error('Failed to fetch profile', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

exports.saveProfile = async (req, res) => {
    try {
        const payload = req.body;
        const saved = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { user: req.user._id, ...payload },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, overwrite: true }
        );
        res.status(200).json(saved.toJSON());
    } catch (error) {
        console.error('Failed to save profile', error);
        res.status(500).json({ message: 'Failed to save profile' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await Profile.deleteOne({ user: req.user._id });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Failed to delete profile', error);
        res.status(500).json({ message: 'Failed to delete profile' });
    }
};
