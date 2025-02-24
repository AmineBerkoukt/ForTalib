import Stats from '../models/Stats.js';
import User from '../models/User.js'; // Assuming you have a User model
import Post from '../models/Post.js'; // Assuming you have a Post model

// @desc    Get the latest stats
// @route   GET /api/stats
// @access  Public

// Get current existing stats
export const getStats = async (req, res) => {
    try {
        // Retrieve the most recent stats entry
        const stats = await Stats.findOne().sort({ statsDate: -1 });

        if (!stats) {
            return res.status(404).json({ message: 'No stats found' });
        }

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};

// @desc    Generate or update stats
// @route   POST /api/stats/generate
// @access  Private (Admin only)

// Generate new stats
export const generateStats = async (req, res) => {
    try {
        // Count total users and posts
        const totalUsers = await User.countDocuments();
        const postsCount = await Post.countDocuments();

        // Create a new stats entry
        const newStats = new Stats({
            totalUsers,
            postsCount,
        });

        const savedStats = await newStats.save();

        res.status(201).json(savedStats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate stats', error: error.message });
    }
};

// @desc    Get all stats (history)
// @route   GET /api/stats/history
// @access  Public

// Stats historisation
export const getStatsHistory = async (req, res) => {
    try {
        // Retrieve all stats entries
        const statsHistory = await Stats.find().sort({ statsDate: -1 });

        res.status(200).json(statsHistory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats history', error: error.message });
    }
};

// @desc    Delete all stats (cleanup)
// @route   DELETE /api/stats
// @access  Private (Admin only)

// Delete all the stats
export const deleteStats = async (req, res) => {
    try {
        // Delete all stats documents
        await Stats.deleteMany();

        res.status(200).json({ message: 'All stats have been deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete stats', error: error.message });
    }
};
