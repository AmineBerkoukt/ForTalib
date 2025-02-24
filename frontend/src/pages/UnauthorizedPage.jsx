import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use `useNavigate` for React Router v6
import { Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const UnauthorizedPage = () => {
    const { isDarkMode } = useTheme();
    const [isShaking, setIsShaking] = useState(false);
    const navigate = useNavigate(); // Initialize `useNavigate`

    useEffect(() => {
        const initialTimer = setTimeout(() => setIsShaking(true), 1000);
        const interval = setInterval(() => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 820);
        }, 4000);
        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    const handleGoBack = () => {
        // Redirect to the homepage or another fallback route
        navigate('/'); // Replace '/' with your desired fallback route
    };

    return (
        <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="text-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 rounded-lg shadow-lg">
                <div className="relative mb-6">
                    <div
                        className={`inline-block transition-transform duration-300 ${
                            isShaking ? 'animate-[wiggle_0.8s_ease-in-out]' : ''
                        }`}
                    >
                        <Lock className="w-20 h-20 mx-auto text-red-500 dark:text-red-400" strokeWidth={1.5} />
                    </div>
                </div>
                <h1 className="text-7xl font-bold text-red-500 dark:text-red-400">403</h1>
                <h2 className="text-2xl font-semibold mt-4">Unauthorized Access</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You do not have the necessary permissions to view this page.
                </p>
                {/* Replace "Return to Login" with "Go Back" */}
                <button
                    onClick={handleGoBack}
                    className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
            <style>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(-15deg); }
                    40% { transform: rotate(15deg); }
                    60% { transform: rotate(-10deg); }
                    80% { transform: rotate(10deg); }
                }
            `}</style>
        </div>
    );
};

export default UnauthorizedPage;