import Layout from "../components/Layout";
import ChatbotContainer from "../components/chatbot/ChatbotContainer";
import { useTheme } from "../contexts/ThemeContext";

const ChatbotPage = () => {
    const { isDarkMode } = useTheme();

    return (
        <Layout isChatPage={true} isDarkMode={isDarkMode}>
            <div className={`max-h-screen flex flex-col ${
                isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
            }`}>
                <div className="flex-2 flex items-center justify-center p-4">
                    <div className={`w-full max-w-4xl h-[85vh] rounded-lg shadow-lg overflow-hidden ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <ChatbotContainer />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChatbotPage;
