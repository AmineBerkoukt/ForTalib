import express from "express";
import {
    getUsersForSidebar,
    getMessages,
    sendMessage,
    aggregateUsersByMessages,
} from "../controllers/messageController.js";
import { uploadMessage } from "../config/upload.js";

const router = express.Router();

// Route to get users for the sidebar (excluding logged-in user)
router.get("/users", getUsersForSidebar);

// Route to aggregate users by messages
router.get("/recent", aggregateUsersByMessages);

// Route to get messages between the logged-in user and another user
router.get("/:id", getMessages);

// Route to send a message (handles text and image uploads together)
router.post("/send/:id", uploadMessage.single("media"), sendMessage );

export default router;