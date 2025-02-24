import express from "express";
import { communicateWithChatbot, getChatbotMessages } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/", communicateWithChatbot);
router.get("/", getChatbotMessages);

export default router;