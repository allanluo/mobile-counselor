const ReadinessAssessment = require('../models/readinessAssessment.model');

exports.getReadiness = async (req, res) => {
    try {
        const doc = await ReadinessAssessment.findOne({ user: req.user._id });
        res.status(200).json(doc ? doc.toJSON() : null);
    } catch (error) {
        console.error('Failed to fetch readiness', error);
        res.status(500).json({ message: 'Failed to fetch readiness' });
    }
};

exports.saveReadiness = async (req, res) => {
    try {
        const assessment = req.body;
        const updated = await ReadinessAssessment.findOneAndUpdate(
            { user: req.user._id },
            { user: req.user._id, ...assessment },
            {
                new: true,
                upsert: true,
                runValidators: true,
                overwrite: true, // replace the existing document to avoid stale fields
                setDefaultsOnInsert: true,
            }
        );
        res.status(200).json(updated?.toJSON());
    } catch (error) {
        console.error('Failed to save readiness', error);
        res.status(500).json({ message: 'Failed to save readiness' });
    }
};
