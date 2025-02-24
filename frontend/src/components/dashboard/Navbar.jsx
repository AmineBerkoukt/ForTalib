import React from 'react'
import { Link } from "react-router-dom";
import { MoonIcon, SunIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar({ isDarkMode, toggleDarkMode, toggleSidebar }) {
    return (
        <nav
            className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left: Logo and Mobile Menu Toggle */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <Link to="/"
                          className={`text-2xl font-bold hover:opacity-90 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        DarIo
                    </Link>
                </div>

                {/* Right: Icons and Actions */}
                <div className="flex items-center space-x-6">
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

