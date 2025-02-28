import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarChat from "../components/chat/SidebarChat.jsx";
import NoChatSelected from "../components/chat/NoChatSelected.jsx";
import ChatContainer from "../components/chat/ChatContainer.jsx";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout.jsx";

const ChatPage = () => {
    const { selectedUser } = useChatStore();
    const { isDarkMode } = useTheme();
    const [isConversationOpen, setIsConversationOpen] = useState(false);

    useEffect(() => {
        if (selectedUser) {
            setIsConversationOpen(true);
        } else {
            setIsConversationOpen(false);
        }
    }, [selectedUser]);

    const handleSidebarClick = (e) => {
        e.preventDefault();
    };

    const toggleConversation = () => {
        setIsConversationOpen(!isConversationOpen);
    };

    return (
        <Layout isChatPage={true} isDarkMode={isDarkMode}>
            <div className={`min-h-screen flex flex-col ${
                isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
            }`}>
                <div className="flex-grow flex items-center justify-center p-2 sm:p-4">
                    <div className={`w-full max-w-7xl h-[calc(100vh-2rem)] sm:h-[85vh] rounded-lg shadow-lg overflow-hidden ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex h-full">
                            <SidebarChat
                                onClick={handleSidebarClick}
                                isWider={selectedUser !== null && !isConversationOpen}
                                isHidden={isConversationOpen}
                            />
                            {!selectedUser && <NoChatSelected />}
                            {selectedUser && (
                                <ChatContainer
                                    isOpen={isConversationOpen}
                                    toggleConversation={toggleConversation}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChatPage;

