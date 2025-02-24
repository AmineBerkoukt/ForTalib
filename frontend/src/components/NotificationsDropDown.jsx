import React from 'react';
import { BellIcon } from "@heroicons/react/24/outline";
import {useTheme} from "../contexts/ThemeContext.jsx";

const NotificationsDropdown = ({ notifications, isOpen, toggleNotifications }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="relative group">
            <div onClick={toggleNotifications} className="cursor-pointer">
                {/* Modify the icon color based on dark mode */}
                <BellIcon
                    className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-blue-500`}
                />
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 z-10">
                    <div className="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">Notifications</p>
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className="px-4 py-2 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <p>{notification.message}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {notification.time}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
