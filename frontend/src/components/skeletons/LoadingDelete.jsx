import React, { useContext } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { ThemeContext } from "../../contexts/ThemeContext";

const LoadingDelete = ({ message = "Deleting user..." }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-6 max-w-md w-full mx-4 sm:mx-auto border`}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <RefreshCw className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </motion.div>
         
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {message}
          </h3>
         
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Please wait while we process your request.
          </p>
         
          <div className="w-full mt-6">
            <div className={`h-1.5 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingDelete;