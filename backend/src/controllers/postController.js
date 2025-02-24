import mongoose from 'mongoose'; // Add this import statement
import Post from '../models/Post.js';
import currentDateTime from '../utils/CurrentDateTime.js';


export const createPost = async (req, res) => {
    const userId = req.user.id; //getting it from the auth middleware

    try {
        const {
            title,
            description,
            price,
            address,
            elevator,
            maximumCapacity,
        } = req.body;


        const sanitizedPostTitle = title.replace(/[\s-]/g, '_');


        const images = req.files ? req.files.map((file) => `/uploads/posts/${userId}/${sanitizedPostTitle}/${file.filename}`) : [];
        console.log(images);

        // Create a new post
        const newPost = new Post({
            userId,
            title,
            description,
            images,
            price,
            address,
            elevator,
            maximumCapacity,
            avgRate: 0
        });

        // Save the post to the database
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({message: 'Failed to create post', error: error.message});
    }
};

export const getAllPosts = async (req, res) => {
    try {
        // Aggregate to calculate the avgRate
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails' // Unwind the userDetails array to access its fields
            },
            {
                $sort: { createdAt: -1 } // -1 for descending order (newest first)
            },
            {
                $project: {
                    // Post fields you want to keep (add or remove as needed)
                    title: 1,               // Include post title
                    description: 1,         // Include post description
                    images: 1,              // Include images
                    price: 1,               // Include price
                    address: 1,             // Include address
                    elevator: 1,            // Include elevator info
                    maximumCapacity: 1,     // Include maximumCapacity
                    avgRate: 1,
                    createdAt: 1,
                    // Specific user fields
                    'user.id': '$userDetails._id',
                    'user.profilePhoto': '$userDetails.profilePhoto',
                    'user.phoneNumber': '$userDetails.phoneNumber',
                    'user.firstName': '$userDetails.firstName',
                    'user.lastName': '$userDetails.lastName',
                    'user.role': '$userDetails.role',

                }
            }
        ]);

        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch posts', error: error.message});
    }
};


export const getAllPostsFiltred = async (req, res) => {
    try {
        const { priceFilter: rawPrice, rateFilter: rawRate } = req.query;

        // Parse and validate price
        const price = rawPrice ? parseFloat(rawPrice) : 10000; // Default to 10000 if not provided
        if (isNaN(price)) {
            return res.status(400).json({ message: "Invalid price filter." });
        }

        // Parse and validate rate
        const rate = rawRate ? parseFloat(rawRate) : 0; // Default to 0 if not provided
        if (isNaN(rate)) {
            return res.status(400).json({ message: "Invalid rate filter." });
        }

        console.log("Parsed Price:", price);
        console.log("Parsed Rate:", rate);

        // Aggregate to calculate the avgRate
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails', // Unwind the userDetails array to access its fields
            },
            {
                $match: {
                    price: { $lte: price }, // Filter posts with price less than or equal to the given value
                    avgRate: { $gte: rate }, // Filter posts with avgRate greater than or equal to the given value
                },
            },
            {
                $sort: { createdAt: -1 }, // -1 for descending order (newest first)
            },
            {
                $project: {
                    // Post fields you want to keep (add or remove as needed)
                    title: 1,
                    description: 1,
                    images: 1,
                    price: 1,
                    address: 1,
                    elevator: 1,
                    maximumCapacity: 1,
                    avgRate: 1,
                    createdAt: 1,
                    // Specific user fields
                    'user.id': '$userDetails._id',
                    'user.profilePhoto': '$userDetails.profilePhoto',
                    'user.phoneNumber': '$userDetails.phoneNumber',
                    'user.firstName': '$userDetails.firstName',
                    'user.lastName': '$userDetails.lastName',
                    'user.role': '$userDetails.role',
                },
            },
        ]);

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
};



export const getTopRatedPosts = async (req, res) => {
    try {
        const topRatedPosts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails' // Unwind the userDetails array to access its fields
            },
            {
                $project: {
                    // Post fields you want to keep (add or remove as needed)
                    title: 1,               // Include post title
                    description: 1,         // Include post description
                    images: 1,              // Include images
                    price: 1,               // Include price
                    address: 1,             // Include address
                    elevator: 1,            // Include elevator info
                    maximumCapacity: 1,     // Include maximumCapacity
                    avgRate: 1,
                    createdAt: 1,
                    // Specific user fields
                    'user.id': '$userDetails._id',
                    'user.profilePhoto': '$userDetails.profilePhoto',
                    'user.phoneNumber': '$userDetails.phoneNumber',
                    'user.firstName': '$userDetails.firstName',
                    'user.lastName': '$userDetails.lastName',
                    'user.role': '$userDetails.role',

                }
            },
            {
                $sort: {avgRate: -1},
            },
            {
                $limit: 5,
            }
        ]);

        res.status(200).json({
            posts: topRatedPosts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in postController. Failed to fetch top-rated posts',
            error: error.message,
        });
    }
};

export const getPostsByUser = async (req, res) => {
    try {
        console.log("Getting posts by user ...")
        let {userId} = req.query;

        userId = new mongoose.Types.ObjectId(userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: 'Invalid user ID'});
        }

        // Aggregate to fetch posts for the authenticated user
        const posts = await Post.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(userId)}, // Match posts by userId
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails', // Unwind the userDetails array to access its fields
            },
            {
                $project: {
                    // Post fields
                    title: 1,
                    description: 1,
                    images: 1,
                    price: 1,
                    address: 1,
                    elevator: 1,
                    maximumCapacity: 1,
                    avgRate: 1,
                    createdAt: 1,
                    // User details fields
                    'user.id': '$userDetails._id',
                    'user.profilePhoto': '$userDetails.profilePhoto',
                    'user.phoneNumber': '$userDetails.phoneNumber',
                    'user.firstName': '$userDetails.firstName',
                    'user.lastName': '$userDetails.lastName',
                    'user.role': '$userDetails.role',

                },
            },
        ]);

        if (!posts || posts.length === 0) {
            return res.status(200).json({message: 'No posts found for this user'});
        }

        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch post', error: error.message});
    }
};


export const updatePost = async (req, res) => {
    try {
        const {id} = req.params;

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedPost) {
            return res.status(404).json({message: 'Post not found'});
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({message: 'Failed to update post', error: error.message});
    }
};


export const deletePost = async (req, res) => {
    try {
        const {id} = req.query;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(200).json({message: 'No Posts left/found for this user'});
            //I changed this for the front end when the user has only 1 post and he deletes it, refetching the data
            //was returning error 404 which was an error
        }

        return res.status(200).json({message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete post', error: error.message});
    }
};



export const getPostById = async (req, res) => {
    try {
        const {id} = req.params;

        const post = await Post.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails' // Unwind the userDetails array to access its fields
            },
            {
                $project: {
                    // Post fields you want to keep (add or remove as needed)
                    title: 1,               // Include post title
                    description: 1,         // Include post description
                    images: 1,              // Include images
                    price: 1,               // Include price
                    address: 1,             // Include address
                    elevator: 1,            // Include elevator info
                    maximumCapacity: 1,     // Include maximumCapacity
                    avgRate: 1,
                    createdAt: 1,
                    // Specific user fields
                    'user.id': '$userDetails._id',
                    'user.profilePhoto': '$userDetails.profilePhoto',
                    'user.phoneNumber': '$userDetails.phoneNumber',
                    'user.firstName': '$userDetails.firstName',
                    'user.lastName': '$userDetails.lastName',
                                        'user.role': '$userDetails.role',

                }
            },
            {
                $project: {
                    ratings: 0,
                },
            },
        ]);

        if (post.length === 0) {
            return res.status(404).json({message: 'Post not found'});
        }

        return res.status(200).json(post[0]);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch post', error: error.message});
    }
};