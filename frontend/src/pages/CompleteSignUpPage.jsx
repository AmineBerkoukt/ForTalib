import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import CompleteSignUp from '../components/CompleteSignUp';
import { Moon, Sun } from 'lucide-react';

const CompleteSignUpPage = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-end pt-4">
                    <button
                        onClick={()=>{
                            toggleDarkMode();
                            console.log("isDarkMode : ", isDarkMode);
                        }}
                        className={`p-2 rounded-lg transition-colors duration-200
                        ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm'
                        }`}
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="py-12">
                    <div className={`text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Just a few more details to get you started
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto overflow-hidden">
                        <CompleteSignUp />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteSignUpPage;