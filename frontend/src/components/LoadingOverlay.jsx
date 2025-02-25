import React from 'react';
import { Loader } from "lucide-react";

const LoadingOverlay = ({ isDarkMode, message = "Creating your post..." }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-200">
            <div className={`
        p-8 rounded-xl shadow-lg 
        ${isDarkMode ? "bg-gray-800 shadow-gray-900/70" : "bg-white shadow-gray-300/70"}
        transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
        flex flex-col items-center max-w-xs w-full mx-4
      `}>
                <div className="relative">
                    <Loader
                        className={`animate-spin ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                        size={48}
                    />
                    <div className={`
            absolute inset-0 
            rounded-full 
            animate-ping 
            ${isDarkMode ? "bg-blue-500/10" : "bg-blue-600/10"}
          `}></div>
                </div>

                <p className={`
          mt-6 font-medium text-center
          ${isDarkMode ? "text-gray-200" : "text-gray-800"}
        `}>
                    {message}
                </p>

                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div className={`
            ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}
            h-1.5 rounded-full animate-progress
          `} style={{width: '0%'}}></div>
                </div>
            </div>
        </div>
    );
};

// Add the necessary keyframe animation
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    0% { width: 5%; }
    50% { width: 70%; }
    100% { width: 90%; }
  }
  
  .animate-progress {
    animation: progress 3s ease-in-out infinite;
  }
  
  .animate-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .slide-in-from-bottom-4 {
    transform: translateY(16px);
  }
`;
document.head.appendChild(style);

export default LoadingOverlay;