import { sessionClient, projectId } from "../config/dialogflow.js";

export async function getDialogflowResponse(text, sessionId) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: { text, languageCode: "en" } // Changed to English
        }
    };
    return sessionClient.detectIntent(request);
}
