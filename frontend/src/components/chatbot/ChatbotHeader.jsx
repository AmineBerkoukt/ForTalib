import { useTheme } from "../../contexts/ThemeContext";

const ChatbotHeader = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`px-4 py-3 border-b ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="size-12 rounded-full">
                        <img src="https://cdn.dribbble.com/users/722835/screenshots/4082720/bot_icon.gif" alt="Chatbot Avatar" />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Your Assistant</h3>
                    <p className="text-sm opacity-70">I help you find your ideal accommodation</p>
                </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></div>
                <span className="text-xs text-gray-500">Online</span>
            </div>
        </div>
    );
};

export default ChatbotHeader;