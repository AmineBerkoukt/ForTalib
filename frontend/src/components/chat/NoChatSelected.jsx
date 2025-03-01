import { MessageSquare } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const NoChatSelected = () => {
  const { isDarkMode } = useTheme();

    const PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME;

  return (
      <div
          className={`w-full flex flex-1 flex-col items-center justify-center p-16 ${
              isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-300 text-gray-900"
          }`}
      >
        <div className="max-w-md text-center space-y-6">
          {/* Icon Display */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
              <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce ${
                      isDarkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-100 text-blue-500"
                  }`}
              >
                <MessageSquare className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-2xl font-bold">Welcome to {PROJECT_NAME} !</h2>
          <p
              className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Select or search a conversation from the sidebar to start chatting !
          </p>
        </div>
      </div>
  );
};

export default NoChatSelected;
