import { useChatStore } from "../../store/useChatStore.js";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import { formatMessageTime } from "../../utils/utils.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);
    const { isDarkMode } = useTheme();
    const [zoomedImage, setZoomedImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const BASEURL = "http://localhost:5000/";
    const id = selectedUser._id ? selectedUser._id : selectedUser.id;

    useEffect(() => {
        getMessages(id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    const handleImageClick = (src) => {
        setZoomedImage(src);
        setIsZoomed(false);
    };

    const handleCloseModal = (e) => {
        if (e.target.id === "modal-backdrop") {
            setZoomedImage(null);
        }
    };

    const toggleZoom = () => {
        setIsZoomed((prev) => !prev);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (zoomedImage && e.key === "Escape") {
                setZoomedImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [zoomedImage]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col h-full">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    const noMessages = messages.length === 0;
    console.info(authUser.profilePhoto)
    console.info(selectedUser)


    return (
        <div className="flex-1 flex flex-col h-full relative">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
                {noMessages ? (
                    <div className="flex items-center justify-center h-full">
                        <div className={`rounded-2xl shadow-2xl text-center p-4 sm:p-6 ${
                            isDarkMode
                                ? 'bg-gray-800 text-gray-100'
                                : 'bg-gradient-to-r from-amber-400 to-purple-500 text-white'
                        }`}>
                            <p className="text-base sm:text-lg font-semibold mb-2">
                                Start your legendary conversation with{" "}
                                <span className={`text-xl sm:text-2xl font-extrabold ${
                                    isDarkMode
                                        ? 'text-emerald-300'
                                        : 'text-emerald-400'
                                }`}>
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={message._id}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={index === messages.length - 1 ? messageEndRef : null}
                        >
                            <div className="chat-image avatar">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border">
                                    <img
                                        src={message.senderId === authUser._id
                                            ? BASE_URL + authUser.profilePhoto || "./avatar.png"
                                            : BASE_URL + selectedUser.profilePhoto || "./avatar.png"}
                                        alt="profile pic"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div
                                className={`chat-bubble flex flex-col ${
                                    isDarkMode
                                        ? "bg-blue-300 text-gray-900"
                                        : "bg-emerald-200 text-gray-900"
                                }`}
                                style={{
                                    maxWidth: '75%',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {message.media && (
                                    <img
                                        src={BASEURL + message.media}
                                        alt="Attachment"
                                        className="max-w-[150px] sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                                        onClick={() => handleImageClick(BASEURL + message.media)}
                                    />
                                )}
                                {message.text && <p className="text-sm sm:text-base">{message.text}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <MessageInput />

            {/* Zoomable Modal */}
            {zoomedImage && (
                <div
                    id="modal-backdrop"
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={handleCloseModal}
                >
                    <TransformWrapper
                        initialScale={1}
                        centerOnInit={true}
                        limitToBounds={true}
                        minScale={1}
                        maxScale={3}
                        wheel={{ disabled: true }}
                    >
                        <TransformComponent>
                            <img
                                src={zoomedImage}
                                alt="Zoomable"
                                className="rounded-lg cursor-pointer"
                                style={{
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                    objectFit: "contain",
                                    transform: isZoomed ? "scale(3)" : "scale(1)",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                                onClick={toggleZoom}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;

