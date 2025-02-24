import { v4 as uuidv4 } from "uuid";
import { io } from "../config/socket.js";
import Message from "../models/Message.js";
import {chatbotId, projectId, sessionClient} from "../config/dialogflow.js";

export const communicateWithChatbot = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

        // Sauvegarder le message de l'utilisateur
        const userMessage = await Message.create({
            senderId: userId,
            receiverId: chatbotId,
            text,
        });

        // Créer une session unique pour Dialogflow
        const sessionId = uuidv4();
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text,
                    languageCode: "en",
                },
            },
        };

        // Envoyer la requête à Dialogflow
        const [response] = await sessionClient.detectIntent(request);
        const botReply = response.queryResult.fulfillmentText;

        // Sauvegarder la réponse du chatbot
        const botMessage = await Message.create({
            senderId: chatbotId,
            receiverId: userId,
            text: botReply,
        });

        // Envoyer la réponse via Socket.IO
        io.to(userId).emit("newMessage", botMessage);

        res.status(200).json({
            userMessage,
            botMessage,
        });
    } catch (error) {
        console.error("Error communicating with chatbot:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChatbotMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: chatbotId },
                { senderId: chatbotId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching chatbot messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};