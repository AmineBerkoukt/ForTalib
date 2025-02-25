import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'; // Import useLocation hook
import {
    ChatBubbleOvalLeftEllipsisIcon,
    MoonIcon,
    SunIcon,
    ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Bot } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from './SearchBar.jsx';

const NavbarFB = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();




    // Check if the current route is "/chat"
    const isChatPage = location.pathname === '/chat';


    function logout() {
        localStorage.clear();
        //navigate("/login");
    }

    return (
        <nav
            className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left: Logo */}

                <Link
                    to="/"
                    className={`text-xl sm:text-2xl font-bold hover:opacity-90 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                >

                    ForTalib
                </Link>

                {/* Center: Search Bar (only show if not on /chat route) */}
                {!isChatPage && (
                    <div className="relative hidden md:block w-1/3">
                        <SearchBar />
                    </div>
                )}

                {/* Right: Icons and Actions */}
                <div className="flex items-center space-x-3 sm:space-x-6">

                    {/* Messages */}
                    <Link to="/chat"
                          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 group"
                    >
                        <div className="relative group">
                            <ChatBubbleOvalLeftEllipsisIcon
                                className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} cursor-pointer group-hover:text-blue-500`}
                            />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                    </Link>


                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 group"
                    >
                        <span className="sr-only">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        {isDarkMode ? (
                            <SunIcon className="h-6 w-6 text-yellow-400"/>
                        ) : (
                            <MoonIcon className="h-6 w-6 text-blue-600"/>
                        )}
                    </button>
                    <button
                        onClick={logout}
                        className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 group"
                    >
                        <span className="sr-only">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        <ArrowLeftStartOnRectangleIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} cursor-pointer group-hover:text-blue-500`}
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavbarFB;
