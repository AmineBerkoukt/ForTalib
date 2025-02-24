import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { MessageSquare } from 'lucide-react';

const AuthImagePattern = ({ title, subtitle }) => {
    const { isDarkMode } = useTheme();

    const gridItems = useMemo(() => {
        return Array(9).fill().map((_, i) => ({
            id: i,
            isPulsing: i % 2 === 0,
            delay: `${i * 0.1}s`
        }));
    }, []);

    return (
        <div
            className={`
                flex items-center justify-center p-8 lg:p-16
                ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
                transition-colors duration-300 ease-in-out
            `}
            role="complementary"
            aria-label="Decorative image pattern"
        >
            <div className="max-w-lg w-full">
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {gridItems.map(({ id, isPulsing, delay }) => (
                        <div
                            key={id}
                            className={`
                                aspect-square rounded-2xl
                                ${isDarkMode ? 'bg-primary/30' : 'bg-primary/20'}
                                ${isPulsing ? 'animate-pulse' : ''}
                                transition-all duration-300 ease-in-out
                                hover:scale-105 hover:shadow-lg
                            `}
                            style={{ animationDelay: delay }}
                        />
                    ))}
                </div>
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h2
                        className={`
                            text-3xl lg:text-4xl font-bold
                            ${isDarkMode ? 'text-white' : 'text-gray-900'}
                            transition-colors duration-300 ease-in-out
                        `}
                    >
                        {title}
                    </h2>
                    <p
                        className={`
                            text-lg lg:text-xl
                            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                            transition-colors duration-300 ease-in-out
                            max-w-md mx-auto
                        `}
                    >
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthImagePattern;
