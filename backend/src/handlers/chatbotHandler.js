import * as DialogflowService from "../services/dialogflowService.js";
import * as MessageService from "../services/messageService.js";
import { formatPostsResponse } from "../utils/formatters.js";
import * as PostService from "../services/postService.js";

const INTENTS = {
    SEARCH_LOGEMENT: 'search_housing',
    PRICE_INFO: 'price_inquiry',
    CAPACITY_INFO: 'capacity_inquiry'
};

export async function handleChatbotMessage(data, socket) {
    try {
        const sessionId = data.userId || socket.id; // Utilisation de socket.id si userId est undefined

        console.log("User ID (sessionId):", data.userId);
        console.log("Text:", data.text);
        console.log("data kamla:", data);

        const [response] = await DialogflowService.getDialogflowResponse(data.text, sessionId);
        console.log('Dialogflow Response:', {
            intent: response.queryResult.intent.displayName,
            parameters: response.queryResult.parameters,
            confidence: response.queryResult.intentDetectionConfidence
        });
        const intent = response.queryResult.intent.displayName;
        const parameters = response.queryResult.parameters;

        let botReply = '';

        switch (intent) {
            case INTENTS.SEARCH_LOGEMENT: {
                const params = response.queryResult.parameters.fields;
                const criteria = {
                    maxPrice: params.max_price?.numberValue,
                    minPrice: params.min_price?.numberValue,
                    address: params.location?.stringValue,
                    capacity: params.capacity?.numberValue,
                    hasElevator: params.elevator?.boolValue,
                };

                const posts = await PostService.searchPosts(criteria);
                console.log('Posts found:', posts); // Pour le debugging

                if (!posts || posts.length === 0) {
                    botReply = "I did not find any accommodation matching your criteria.";
                } else {
                    botReply = {
                        type: 'posts',
                        data: posts
                    };
                }
                break;
            }

            case INTENTS.PRICE_INFO: {
                const avgPrice = await PostService.getAveragePrice(parameters.location);
                botReply = avgPrice
                    ? `The average price in ${parameters.location} is ${avgPrice.toFixed(0)}Dhs per month.`
                    : `Sorry, I don't have pricing information for ${parameters.location}.`;
                break;
            }

            default:
                botReply = response.queryResult.fulfillmentText;
        }

        const UserMessage = await MessageService.createUserMessage(data.userId, data.text);
        const botMessage = await MessageService.createBotMessage(data.userId, botReply, {
            intent,
            parameters
        });

        socket.emit("messageResponse", UserMessage);
        socket.emit("messageResponse", botMessage);

    } catch (error) {
        console.error('Chatbot error:', error);
        socket.emit("chatbotError", {
            message: "Sorry, I'm experiencing difficulties. Could you rephrase your request?"
        });
    }
}