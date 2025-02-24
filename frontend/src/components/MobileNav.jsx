import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    MoonIcon,
    SunIcon,
} from '@heroicons/react/24/outline';

import NotificationsDropdown from "./NotificationsDropDown.jsx";
import SearchBar from "./SearchBar.jsx";
import {useTheme} from "../contexts/ThemeContext.jsx";

const MobileNav = ({ onSidebarToggle, isDarkMode }) => {
    const navigate = useNavigate();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const { toggleDarkMode } = useTheme();

    const notifications = [
        { id: 1, message: 'You have a new message from John.', time: '2 mins ago' },
        { id: 2, message: 'Your profile has been updated successfully.', time: '1 hour ago' },
        { id: 3, message: 'New comment on your post.', time: '5 hours ago' },
    ];

    const toggleNotifications = () => setNotificationsOpen(prev => !prev);

    return (
        <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
            isDarkMode
                ? 'bg-gray-900/95 text-gray-100 shadow-lg shadow-gray-900/20'
                : 'bg-white/95 text-gray-900 shadow-lg'
        } backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 px-4">
                    {!isSearchVisible ? (
                        <>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onSidebarToggle}
                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                        isDarkMode
                                            ? 'hover:bg-gray-800 active:bg-gray-700'
                                            : 'hover:bg-gray-100 active:bg-gray-200'
                                    }`}
                                    aria-label="Toggle sidebar"
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </button>

                                <Link
                                    to="/"
                                    className={`text-2xl font-bold transition-colors duration-200 ${
                                        isDarkMode
                                            ? 'text-blue-400 hover:text-blue-300'
                                            : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                    DarIo
                                </Link>
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => navigate("/chat")}
                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                        isDarkMode
                                            ? 'hover:bg-gray-800 active:bg-gray-700'
                                            : 'hover:bg-gray-100 active:bg-gray-200'
                                    }`}
                                    aria-label="Chat"
                                >
                                    <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6"/>
                                </button>
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
                                    onClick={() => setIsSearchVisible(true)}
                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                        isDarkMode
                                            ? 'hover:bg-gray-800 active:bg-gray-700'
                                            : 'hover:bg-gray-100 active:bg-gray-200'
                                    }`}
                                    aria-label="Search"
                                >
                                    <MagnifyingGlassIcon className="h-6 w-6"/>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center gap-2">
                            <button
                                onClick={() => setIsSearchVisible(false)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                    isDarkMode
                                        ? 'hover:bg-gray-800 active:bg-gray-700'
                                        : 'hover:bg-gray-100 active:bg-gray-200'
                                }`}
                                aria-label="Close search"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                            <SearchBar className="block w-full" />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MobileNav;