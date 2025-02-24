import User from "../models/User.js";
import Message from "../models/Message.js";
import {getReceiverSocketId, io} from "../config/socket.js";
import mongoose from "mongoose";


export const aggregateUsersByMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const aggregatedUsers = await Message.aggregate([
            // Match messages involving the logged-in user as sender or receiver
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(loggedInUserId) },
                        { receiverId: new mongoose.Types.ObjectId(loggedInUserId) },
                    ],
                },
            },
            // Group by the user (other than the logged-in user)
            {
                $group: {
                    _id: {
                        $cond: [
                            { $ne: ["$senderId", new mongoose.Types.ObjectId(loggedInUserId)] },
                            "$senderId",
                            "$receiverId",
                        ],
                    },
                    lastInteraction: { $max: "$lastInteraction" },
                },
            },
            // Sort by lastInteraction in descending order
            { $sort: { lastInteraction: -1 } },
            // Lookup user details for the distinct user IDs
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            // Unwind the user array to get a flat structure
            { $unwind: "$user" },
            // Select necessary fields while excluding credentials
            {
                $project: {
                    lastInteraction: 1,
                    "user._id": 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "user.profilePhoto": 1,
                },
            },
        ]);

        res.status(200).json(aggregatedUsers);
    } catch (error) {
        console.error("Error in aggregateUsersByMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



/**
 * Get users for the sidebar (excluding the logged-in user)
 */
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

/**
 * Get messages between the logged-in user and another user
 */
export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user.id;


        const messages = await Message.find({
            $or: [{senderId: myId, receiverId: userToChatId}, {senderId: userToChatId, receiverId: myId},],
        }).sort({createdAt: 1}); // Sort messages chronologically

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

/**
 * Send a new message and notify the receiver via socket
 * Note: `uploadPostImages` middleware should be used in the route.
 */

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const {receiverId, text} = req.body;
        let actualDate = new Date()

        let imageUrl = null;
        if (req.file) {
            const fileName = req.file.filename;
            imageUrl = `uploads/messages/${senderId}-${receiverId}/${fileName}`
        }

        const newMessage = new Message({
            senderId, receiverId, text, media: imageUrl,
            lastInteraction: actualDate,
        });

        await newMessage.save();

        // Notify the receiver via Socket.IO if connected
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({error: "Internal server error" });
    }
};
