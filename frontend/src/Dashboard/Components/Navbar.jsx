import React, { useState } from 'react'
import { Bell, Menu, Sun, Moon, User } from 'lucide-react'
import {useTheme} from "../../contexts/ThemeContext.jsx";
import {Link} from "react-router-dom";
import SearchBar from "../../components/SearchBar.jsx";
import {BellIcon, ChatBubbleOvalLeftEllipsisIcon, MoonIcon, SunIcon} from "@heroicons/react/24/outline/index.js";

export default function Navbar({ isDarkMode, toggleDarkMode }) {

    return (
        <nav
            className={`py-2 px-4 border-b border-gray-200 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left: Logo */}

                <Link to="/fb"
                      className={`text-2xl font-bold hover:opacity-90 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    DarIo

                </Link>

                {/* Right: Icons and Actions */}
                <div className="flex items-center space-x-6">

                    {/* User Avatar */}
                    <img
                        src="/avatar-placeholder.png"
                        alt="User"
                        className="h-8 w-8 rounded-full cursor-pointer hover:opacity-90"
                    />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 group"
                    >
                        <span className="sr-only">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        {isDarkMode ? (
                            <SunIcon className="h-6 w-6 text-gray-300"/>
                        ) : (
                            <MoonIcon className="h-6 w-6 text-gray-600"/>
                        )}

                    </button>
                </div>
            </div>

        </nav>
    )
}
