import { useState } from "react";
import { Send } from "lucide-react";
import { useChatbotStore } from "../../store/useChatbotStore";
import { useTheme } from "../../contexts/ThemeContext";

const ChatbotMessageInput = () => {
    const [text, setText] = useState("");
    const { sendMessage } = useChatbotStore();
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await sendMessage(text.trim());
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div
            className={`p-4 w-full border-t border-gray-500 ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
        >
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    className={`flex-1 rounded-lg py-2 px-3 outline-none ${
                        isDarkMode
                            ? "bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-600"
                            : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-200"
                    }`}
                    placeholder="Ask your question about shared accommodations..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className={`btn btn-circle ${
                        isDarkMode
                            ? "bg-blue-600 hover:bg-blue-500"
                            : "bg-blue-500 hover:bg-blue-400"
                    }`}
                    disabled={!text.trim()}
                >
                    <Send
                        size={22}
                        className={isDarkMode ? "text-gray-100" : "text-gray-900"}
                    />
                </button>
            </form>
        </div>
    );
};

export default ChatbotMessageInput;