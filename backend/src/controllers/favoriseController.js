import Favorise from '../models/Favorise.js';
import Post from '../models/Post.js';
import mongoose from "mongoose";

export const addFavorise = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        console.log('Add favorise Post id : ' , postId )


        const existingFavorise = await Favorise.findOne({ userId, postId });
        if (existingFavorise) {
            return res.status(400).json({ message: 'Post is already in favorites' });
        }

        const newFavorise = new Favorise({ userId, postId });
        await newFavorise.save();

        res.status(201).json({ message: 'Post added to favorites', favorise: newFavorise });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to favorites', error: error.message });
    }
};

export const removeFavorise = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        console.log('Remove favorise Post id : ' , postId )


        const deletedFavorise = await Favorise.findOneAndDelete({ userId, postId });

        if (!deletedFavorise) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
};


export const getAllFavorises = async (req, res) => {
    try {
        const userId = req.user.id;

        // Step 1: Retrieve favorite post IDs for the user
        const favorises = await Favorise.find({ userId }).select('postId');
        if (!favorises || favorises.length === 0) {
            return res.status(404).json({ message: 'No favorites found for this user.' });
        }

        console.log("Favorises: ", favorises);

        // Step 2: Extract and validate post IDs
        const postIds = favorises.map(fav => fav.postId.toString());
        const validPostIds = postIds.map(id => new mongoose.Types.ObjectId(id));

        // Step 3: Fetch posts corresponding to the post IDs
        const postsFavorises = await Post.find({ _id: { $in: validPostIds } })
            .populate({
                path: 'userId', // Join with the userId field
                model: 'User',
                select: 'firstName lastName phoneNumber profilePhoto' // Select necessary fields
            });

        if (!postsFavorises || postsFavorises.length === 0) {
            return res.status(404).json({ message: 'No posts associated with these favorites.' });
        }

        console.log("Posts Favorises: ", postsFavorises);

        // Step 4: Format the response
        const formattedResponse = postsFavorises.map(post => ({
            _id: post._id,
            title: post.title,
            description: post.description,
            images: post.images,
            price: post.price,
            address: post.address,
            elevator: post.elevator,
            maximumCapacity: post.maximumCapacity,
            likesCount: post.likesCount,
            avgRate: post.avgRate,
            creationDate: post.creationDate,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.userId ? {
                id: post.userId._id,
                firstName: post.userId.firstName,
                lastName: post.userId.lastName,
                phoneNumber: post.userId.phoneNumber,
                profilePhoto: post.userId.profilePhoto
            } : null
        }));

        console.log("Formatted Response: ", formattedResponse);

        // Step 5: Send the response
        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: 'Error fetching favorite posts', error: error.message });
    }
};
