import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

const EnhancedLoadingSpinner = ({ message = "Loading your experience..." }) => {
    const [progress, setProgress] = useState(0);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const { isDarkMode } = useTheme();

    const loadingMessages = [
        "Preparing your experience...",
        "Almost there...",
        "Finalizing details..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0;

                // Change loading message at certain progress points
                if (prev === 30) setLoadingPhase(1);
                if (prev === 70) setLoadingPhase(2);

                return prev + 1;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${
                isDarkMode
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800'
                    : 'bg-gradient-to-b from-blue-50 to-gray-100'
            }`}
        >
            <div className="relative w-24 h-24 mb-6 sm:w-32 sm:h-32">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 animate-spin-slow">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" className={isDarkMode ? "stop-color-blue-400" : "stop-color-blue-500"} />
                                <stop offset="100%" className={isDarkMode ? "stop-color-purple-400" : "stop-color-purple-600"} />
                            </linearGradient>
                        </defs>
                        <circle
                            className={isDarkMode ? 'text-gray-700' : 'text-gray-200'}
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r="46"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            stroke="url(#spinner-gradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="transparent"
                            r="46"
                            cx="50"
                            cy="50"
                            strokeDasharray="289"
                            strokeDashoffset={289 - (289 * progress) / 100}
                            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                        />
                    </svg>
                </div>

                {/* Inner progress circle */}
                <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className={isDarkMode ? 'text-gray-800' : 'text-gray-100'}
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="38"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className={isDarkMode ? 'text-blue-400' : 'text-blue-500'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="38"
                            cx="50"
                            cy="50"
                            strokeDasharray="239"
                            strokeDashoffset={239 - (239 * progress) / 100}
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                </div>

                {/* Logo in the center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-2xl font-bold filter drop-shadow-md ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                        <span className="inline-block animate-pulse">C</span>
                        <span className="inline-block animate-bounce delay-75">o</span>
                        <span className="inline-block animate-pulse delay-150">R</span>
                        <span className="inline-block animate-bounce delay-200">e</span>
                        <span className="inline-block animate-pulse delay-250">n</span>
                        <span className="inline-block animate-bounce delay-300">t</span>
                    </div>
                </div>
            </div>

            {/* Loading text with fade-in effect */}
            <div className={`mt-4 text-lg font-medium animate-pulse ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
                {loadingMessages[loadingPhase]}
            </div>

            {/* Progress bar */}
            <div className="w-64 h-2 mt-4 bg-gray-300 rounded-full overflow-hidden dark:bg-gray-700">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Percentage counter */}
            <div className={`mt-2 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
                {progress}%
            </div>

            {/* Mobile-friendly hint */}
            <div className={`mt-6 text-xs px-4 text-center max-w-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
                Optimized for all devices
            </div>
        </div>
    );
};

export default EnhancedLoadingSpinner;