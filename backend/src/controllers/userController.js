import User from '../models/User.js';
import Request from '../models/Request.js';
import Post from '../models/Post.js';
import Evaluate from '../models/Evaluate.js';
import Favorise from '../models/Favorise.js';
import Message from '../models/Message.js';
import path from "path";
import bcrypt from 'bcryptjs'; // Assure-toi d'installer bcryptjs (npm install bcryptjs)


// Controller to fetch all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// Controller to create a new user
export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        user.role = 'admin';
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Failed to create user" });
    }
};

// Controller to update a user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, address, phoneNumber, cin } = req.body;

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        let profilePhotoPath = user.profilePhoto; // Par défaut, garder l'ancienne photo
        if (req.file) {
            //profilePhotoPath = `/uploads/${path.basename(req.file.path)}`;
            profilePhotoPath = `/uploads/${req.user.id}/${path.basename(req.file.path)}`;
        //http://localhost:5000//uploads/27-12-2024_01-18-49-Capture.png
        }
        // http://localhost:5000//uploads/27-12-2024_01-18-49-Capture.png
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                address,
                phoneNumber,
                cin,
                profilePhoto: profilePhotoPath,
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};


export const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user by ID
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the role of the user to 'admin'
        user.role = 'admin';
        await user.save();

        res.status(200).json({
            message: "User role updated to admin successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user role",
            error: error.message,
        });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        // req.user is added by the authenticateToken middleware
        const user = await User.findById(req.user.id)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving profile',
            error: error.message
        });
    }
};

// Controller to search for users by a keyword
export const searchUsers = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ message: "Keyword is required" });
        }

        // Split the keyword into parts (e.g., ["Amine", "BK"])
        const nameParts = keyword.trim().split(/\s+/);

        let query = {};
        if (nameParts.length === 1) {
            // If there's only one word, search in firstName or lastName
            query = {
                $or: [
                    { firstName: { $regex: nameParts[0], $options: 'i' } },
                    { lastName: { $regex: nameParts[0], $options: 'i' } },
                ],
            };
        } else {
            // If there are multiple parts, combine them for a full name search
            query = {
                $or: [
                    {
                        $and: [
                            { firstName: { $regex: nameParts[0], $options: 'i' } },
                            { lastName: { $regex: nameParts[1], $options: 'i' } },
                        ],
                    },
                    {
                        $and: [
                            { firstName: { $regex: nameParts[1], $options: 'i' } },
                            { lastName: { $regex: nameParts[0], $options: 'i' } },
                        ],
                    },
                ],
            };
        }

        // Perform the search with the constructed query
        const users = await User.find(query);

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to search users", error: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({message: "no user found"});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: "failed to get user",  error: error.message});
    }
};

// Controller to delete a user and all related data
export const deleteUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
        // Delete the user
        await User.findByIdAndDelete(id);

        // Delete all posts by the user
        await Post.deleteMany({ userId: id });

        // Delete all evaluations by the user
        await Evaluate.deleteMany({ userId: id });

        // Delete all favorites by the user
        await Favorise.deleteMany({ userId: id });

        // Delete all messages sent or received by the user
        await Message.deleteMany({ $or: [{ senderId: id }, { receiverId: id }] });

        // Delete all requests by the user
        await Request.deleteMany({ userId: id });

        // Send a success response
        res.status(200).json({ message: 'User and all related data deleted successfully' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to delete user and related data', error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old password and new password are required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to update password", error: error.message });
    }
};
