import React, { useEffect, useState } from 'react';
import { Search, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [searchPos, setSearchPos] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSearchPos((prev) => (prev === 0 ? 1 : 0));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
            <div className="max-w-lg w-full text-center space-y-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 rounded-lg shadow-lg">
                <div className="relative">
                    <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-transparent bg-clip-text">
                        404
                    </h1>
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out ${
                            searchPos ? 'left-1/4' : 'left-2/3'
                        }`}
                    >
                        <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 animate-bounce" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We've searched high and low, but couldn't find what you're looking for.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                        The page might have been moved, deleted, or never existed in the first place.
                    </p>
                </div>
                <div className="pt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto"
                    >
                        <Home className="w-5 h-5" />
                        <span>Return Home</span>
                    </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <p>Or try one of these:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Explore Feed', 'Popular Posts', 'Recent Activity', 'Help Center'].map((text) => (
                            <button
                                key={text}
                                onClick={() => navigate('/')}
                                className="underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
