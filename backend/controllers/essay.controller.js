const Essay = require('../models/essay.model');

exports.listEssays = async (req, res) => {
    try {
        const essays = await Essay.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(essays);
    } catch (error) {
        console.error('Failed to fetch essays', error);
        res.status(500).json({ message: 'Failed to fetch essays' });
    }
};

exports.createEssay = async (req, res) => {
    try {
        const { collegeName, prompt, content } = req.body;
        if (!collegeName || !prompt) {
            return res.status(400).json({ message: 'collegeName and prompt are required' });
        }
        const essay = await Essay.create({
            user: req.user._id,
            collegeName,
            prompt,
            content: content || '',
            lastEdited: new Date(),
        });
        res.status(201).json(essay);
    } catch (error) {
        console.error('Failed to create essay', error);
        res.status(500).json({ message: 'Failed to create essay' });
    }
};

exports.updateEssay = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body, lastEdited: new Date() };
        const essay = await Essay.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updates,
            { new: true, runValidators: true }
        );
        if (!essay) return res.status(404).json({ message: 'Essay not found' });
        res.status(200).json(essay);
    } catch (error) {
        console.error('Failed to update essay', error);
        res.status(500).json({ message: 'Failed to update essay' });
    }
};

exports.deleteEssay = async (req, res) => {
    try {
        const { id } = req.params;
        const essay = await Essay.findOneAndDelete({ _id: id, user: req.user._id });
        if (!essay) return res.status(404).json({ message: 'Essay not found' });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Failed to delete essay', error);
        res.status(500).json({ message: 'Failed to delete essay' });
    }
};
