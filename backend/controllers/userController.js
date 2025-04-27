const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
        console.log('getUsers: Starting user fetch');
        const users = await userModel.find().select('name email isActive activeUntil');
        console.log('getUsers: Users fetched, count:', users.length);
        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            isActive: user.isActive,
            activeUntil: user.activeUntil
        }));
        return res.json(formattedUsers);
    } catch (error) {
        console.error('getUsers error:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

const toggleActivation = async (req, res) => {
    const { id } = req.params;
    console.log('toggleActivation: Received request for ID:', id);
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('toggleActivation: MongoDB not connected, state:', mongoose.connection.readyState);
            return res.status(500).json({ success: false, message: 'Database connection error' });
        }
        
        // Validate ObjectId
        console.log('toggleActivation: Validating ObjectId:', id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('toggleActivation: Invalid ObjectId:', id);
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }
        
        // Find user
        console.log('toggleActivation: Querying user by ID:', id);
        const user = await userModel.findById(id);
        if (!user) {
            console.log('toggleActivation: User not found:', id);
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log('toggleActivation: User found:', user.email);

        // Toggle activation
        const newStatus = !user.isActive;
        user.isActive = newStatus;
        user.activeUntil = newStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
        
        // Save user
        await user.save();
        console.log('toggleActivation: User updated:', { id, isActive: newStatus, activeUntil: user.activeUntil });

        return res.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                isActive: user.isActive,
                activeUntil: user.activeUntil
            }
        });
    } catch (error) {
        console.error('toggleActivation error:', error.name, error.message, error.stack);
        if (error.name === 'ValidationError') {
            console.log('toggleActivation: Validation error details:', error.errors);
            return res.status(400).json({
                success: false,
                message: 'User validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({ success: false, message: 'Failed to update activation status' });
    }
};

module.exports = { getUsers, toggleActivation };
