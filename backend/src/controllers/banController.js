import User from '../models/User.js';
import Blacklist from "../models/Blacklist.js";
import {sendEmail} from "../services/emailService.js";
import {deleteUser} from "./userController.js";
import {getReceiverSocketId} from "../config/socket.js";

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

        req.params.id = userId;
        await deleteUser(req, res, true);

        const socketId = getReceiverSocketId(userId);
        if (socketId) {
            io.to(socketId).emit("forceLogout", "You have been banned!");
        }

        const subject = "Your account has been banned";
        const htmlContent = `
            <p>Dear ${user.firstName},</p>
            <p>We regret to inform you that your account has been banned due to violation of platform rules.</p>
            <p>If you believe this is a mistake, please contact our support team.</p>
            <p>Best regards,<br>Platform Team</p>
        `;
        await sendEmail(user.email, subject, htmlContent);
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

        // Envoyer un email de réactivation
        const subject = "Your account has been restored";
        const htmlContent = `
            <p>Dear ${bannedUser.firstName},</p>
            <p>Your account has been reinstated. You can now log in again.</p>
            <p>Welcome back!</p>
            <p>Best regards,<br>Platform Team</p>
        `;
        await sendEmail(bannedUser.email, subject, htmlContent);

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