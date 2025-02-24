import {useEffect, useRef} from "react";
import {useChatbotStore} from "../../store/useChatbotStore";
import {useAuthStore} from "../../store/useAuthStore";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessageInput from "./ChatbotMessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import {formatMessageTime} from "../../utils/utils";
import {useTheme} from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import PostMessage from "./PostMessage.jsx";
import PostDetailsModalForChatbot from './PostDetailsModalForChatbot';
import { motion, AnimatePresence } from 'framer-motion';
const BASE_URL = import.meta.env.VITE_PFP_URL;

const ChatbotContainer = () => {
    const {messages, isLoading, getMessages} = useChatbotStore();
    const {authUser, socket} = useAuthStore();
    const messageEndRef = useRef(null);
    const {isDarkMode} = useTheme();

    useEffect(() => {
        socket?.on("messageResponse", (message) => {
            useChatbotStore.getState().addMessage(message);
        });

        socket?.on("chatbotError", (error) => {
            toast.error(error.message);
        });

        return () => {
            socket?.off("messageResponse");
            socket?.off("chatbotError");
        };
    }, [socket]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col h-full">
                <ChatbotHeader/>
                <MessageSkeleton/>
                <ChatbotMessageInput/>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <ChatbotHeader/>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    // Improved welcome message
                    <div className="flex items-center justify-center h-full">
                        <motion.div
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            className={`rounded-2xl shadow-2xl text-center p-8 ${
                                isDarkMode
                                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100'
                                    : 'bg-gradient-to-br from-amber-100 to-purple-100 text-gray-800'
                            }`}
                        >
                            <div className="mb-4">
                                <img
                                    src="https://cdn.dribbble.com/users/722835/screenshots/4082720/bot_icon.gif"
                                    className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-white shadow-lg"
                                    alt="Chatbot Avatar"
                                />
                            </div>
                            <p className="text-xl font-bold mb-2">👋 Hello {authUser?.firstName}!</p>
                            <p className="text-sm opacity-90 mb-4">
                                I am your assistant to find the ideal shared accommodation 🏡<br/>
                                Ask me your questions or try these examples:
                            </p>
                            <div className="flex flex-col gap-2 text-left">
                                <button
                                    className="text-sm p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                    "Find a house in Irfan2 under 3000 Dhs"
                                </button>
                                <button
                                    className="text-sm p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                    "I need a house in Epsilon for 3 people with maximum budget 3000 Dhs"
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <motion.div
                            key={message._id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} mb-4`}
                            ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border-2 border-white shadow-md">
                                    <img
                                        src={message.senderId === authUser._id ? BASE_URL + authUser.profilePhoto || "/avatar.png" : "https://cdn.dribbble.com/users/722835/screenshots/4082720/bot_icon.gif"}
                                        className="object-cover"
                                        alt="profile"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1 flex items-center gap-2">
                                <span className="text-xs font-medium">
                                    {message.senderId === authUser._id ? "You" : "Assistant"}
                                </span>
                                <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
                            </div>
                            <div className={`chat-bubble ${
                                isDarkMode
                                    ? message.senderId === authUser._id
                                        ? "bg-gray-700 text-white"
                                        : "bg-blue-800 text-white"
                                    : message.senderId === authUser._id
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-100 text-gray-800"
                            } rounded-2xl shadow-sm`}>
                                {message.text.type === 'posts' ? (
                                    <div className="space-y-4">
                                        <p className="font-medium text-sm mb-2">🔍 Here are the accommodations matching your search:</p>
                                        <div className="grid gap-4">
                                            {message.text.data.map((post, index) => (
                                                <PostMessage key={index} post={post}/>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <ChatbotMessageInput/>
            <PostDetailsModalForChatbot/>
        </div>
    );
};

export default ChatbotContainer;