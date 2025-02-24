import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = ({ isDarkMode }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-md transition-all duration-300 
                        transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-900'
                        : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 focus:ring-offset-white'
                    }`}
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;

