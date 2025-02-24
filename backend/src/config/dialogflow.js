import dotenv from "dotenv";
import {SessionsClient} from "@google-cloud/dialogflow";
import mongoose from "mongoose";

dotenv.config();

export const projectId = process.env.DIALOGFLOW_PROJECT_ID;
export const chatbotId = new mongoose.Types.ObjectId("64b7f1f2e7a9c0b8dbe53aaa");

//export const chatbotId = "chatbot"; // ID fictif pour le chatbot

export const sessionClient = new SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
