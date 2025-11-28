const RoadmapTask = require('../models/roadmapTask.model');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await RoadmapTask.find({ user: req.user._id }).sort({ createdAt: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Failed to fetch roadmap tasks', error);
        res.status(500).json({ message: 'Failed to fetch roadmap tasks' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, date, category } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = await RoadmapTask.create({
            user: req.user._id,
            title,
            description,
            status,
            date,
            category,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Failed to create roadmap task', error);
        res.status(500).json({ message: 'Failed to create roadmap task' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await RoadmapTask.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Failed to update roadmap task', error);
        res.status(500).json({ message: 'Failed to update roadmap task' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await RoadmapTask.findOneAndDelete({ _id: id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Failed to delete roadmap task', error);
        res.status(500).json({ message: 'Failed to delete roadmap task' });
    }
};

exports.replaceTasks = async (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks)) {
            return res.status(400).json({ message: 'Tasks array is required' });
        }

        // Replace all existing tasks for the user with the new list
        await RoadmapTask.deleteMany({ user: req.user._id });

        const payload = tasks.map(t => ({
            user: req.user._id,
            title: t.title,
            description: t.description || '',
            status: t.status || 'pending',
            date: t.date || 'TBD',
            category: t.category || 'application',
        }));

        const created = await RoadmapTask.insertMany(payload);

        res.status(200).json(created.map(doc => doc.toJSON()));
    } catch (error) {
        console.error('Failed to replace roadmap tasks', error);
        res.status(500).json({ message: 'Failed to replace roadmap tasks' });
    }
};
