import Message from '../models/Message.js';
import {chatbotId} from "../config/dialogflow.js";

export async function createBotMessage(userId, text, metadata = {}) {
    return Message.create({
        senderId: chatbotId,
        receiverId: userId,
        text,
        metadata
    });
}
export async function createUserMessage(userId, text, metadata = {}) {
    return Message.create({
        senderId: userId ,
        receiverId: chatbotId,
        text,
        metadata
    });
}

