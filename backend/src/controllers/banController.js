import User from '../models/User.js';
import Blacklist from "../models/Blacklist.js";
import {sendEmail} from "../services/emailService.js";
import {deleteUser} from "./userController.js";
import {getReceiverSocketId} from "../config/socket.js";
import Post from "../models/Post.js";
import Evaluate from "../models/Evaluate.js";
import Save from "../models/Save.js";
import Message from "../models/Message.js";
import Request from "../models/Request.js";

export const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyBanned = await Blacklist.findOne({ email: user.email });
        if (alreadyBanned) {
            return res.status(409).json({ message: "User is already banned" });
        }

        await Blacklist.create(user.toObject());

        await User.findByIdAndDelete(userId);
        await Post.deleteMany({ userId: userId });
        await Evaluate.deleteMany({ userId: userId });
        await Save.deleteMany({ userId: userId });
        await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
        await Request.deleteMany({ userId: userId });

        const socketId = getReceiverSocketId(userId);
        if (socketId) {
            io.to(socketId).emit("forceLogout", "You have been banned!");
        }


        res.status(200).json({ message: "User banned successfully" });

    } catch (error) {
        console.error(`[banUser] Error banning user:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error banning user", error: error.message });
        }
    }
};


export const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const bannedUser = await Blacklist.findById(userId);

        await User.create(bannedUser.toObject());

        await Blacklist.findByIdAndDelete(userId);


        res.status(200).json({ message: "User unbanned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unbanning user", error });
    }
};

export const getBannedUsers = async (req, res) => {
    try {
        const bannedUsers = await Blacklist.find();
        res.status(200).json(bannedUsers);
    } catch (error) {
        console.error("Error fetching banned users:", error.message);
        res.status(500).json({ message: "Failed to fetch banned users" });
    }
};