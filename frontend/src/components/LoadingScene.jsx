import React, { useState, useRef, useEffect } from "react";
import { User, Image, MessageSquare, ChevronDown, Bell, Settings, LogOut } from "lucide-react";

const LoadingScene = ({ isDarkMode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Dynamic classes based on dark mode
    const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
    const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
    const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
    const skeletonColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
    const hoverColor = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header with dropdown */}
            <header className={`sticky top-0 z-50 ${bgColor} border-b ${borderColor} py-4 px-6 flex justify-between items-center shadow-sm`}>
                <div className="flex items-center space-x-2">
                    <div className={`${skeletonColor} rounded-full w-8 h-8 animate-pulse`}></div>
                    <div className={`${skeletonColor} rounded-md w-24 h-4 animate-pulse`}></div>
                </div>

                {/* Dropdown menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className={`flex items-center space-x-1 p-2 rounded-md ${hoverColor} transition-colors`}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className={`${skeletonColor} rounded-full w-8 h-8`}></div>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown content with absolute positioning and higher z-index */}
                    {isDropdownOpen && (
                        <div
                            className={`absolute right-0 mt-2 w-48 ${bgColor} border ${borderColor} rounded-md shadow-lg py-1 z-50`}
                        >
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <div className={`${skeletonColor} rounded-md w-full h-4 mb-2 animate-pulse`}></div>
                                <div className={`${skeletonColor} rounded-md w-2/3 h-3 animate-pulse`}></div>
                            </div>
                            <ul>
                                <li>
                                    <a href="#" className={`flex items-center px-4 py-2 ${hoverColor} transition-colors`}>
                                        <User size={16} className="mr-2" />
                                        <span>Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className={`flex items-center px-4 py-2 ${hoverColor} transition-colors`}>
                                        <Bell size={16} className="mr-2" />
                                        <span>Notifications</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className={`flex items-center px-4 py-2 ${hoverColor} transition-colors`}>
                                        <Settings size={16} className="mr-2" />
                                        <span>Settings</span>
                                    </a>
                                </li>
                                <li className={`border-t ${borderColor} mt-1`}>
                                    <a href="#" className={`flex items-center px-4 py-2 text-red-500 ${hoverColor} transition-colors`}>
                                        <LogOut size={16} className="mr-2" />
                                        <span>Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Profile skeleton */}
                <div className={`mb-8 p-6 border ${borderColor} rounded-lg ${bgColor} shadow-sm`}>
                    <div className="flex items-center mb-4">
                        <div className={`${skeletonColor} rounded-full w-16 h-16 animate-pulse mr-4`}></div>
                        <div className="flex-1">
                            <div className={`${skeletonColor} rounded-md w-3/4 h-5 animate-pulse mb-2`}></div>
                            <div className={`${skeletonColor} rounded-md w-1/2 h-4 animate-pulse`}></div>
                        </div>
                    </div>
                    <div className={`${skeletonColor} rounded-md w-full h-20 animate-pulse`}></div>
                </div>

                {/* Posts skeleton */}
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-6 border ${borderColor} rounded-lg ${bgColor} shadow-sm`}>
                            <div className="flex items-center mb-4">
                                <div className={`${skeletonColor} rounded-full w-10 h-10 animate-pulse mr-3`}></div>
                                <div className="flex-1">
                                    <div className={`${skeletonColor} rounded-md w-1/3 h-4 animate-pulse mb-2`}></div>
                                    <div className={`${skeletonColor} rounded-md w-1/4 h-3 animate-pulse`}></div>
                                </div>
                            </div>
                            <div className={`${skeletonColor} rounded-md w-full h-40 animate-pulse mb-4`}></div>
                            <div className="flex items-center pt-2">
                <span className="flex items-center mr-4">
                  <MessageSquare size={16} className="mr-1 opacity-50" />
                  <div className={`${skeletonColor} rounded-md w-8 h-3 animate-pulse`}></div>
                </span>
                                <span className="flex items-center">
                  <Image size={16} className="mr-1 opacity-50" />
                  <div className={`${skeletonColor} rounded-md w-8 h-3 animate-pulse`}></div>
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Animated icons */}
                <div className="flex justify-center items-center mt-8 space-x-4">
                    <User className={`w-6 h-6 opacity-50 animate-pulse`} />
                    <Image className={`w-6 h-6 opacity-50 animate-pulse`} />
                    <MessageSquare className={`w-6 h-6 opacity-50 animate-pulse`} />
                </div>

                {/* Loading text */}
                <div className="text-center mt-6">
                    <p className="animate-pulse">Loading profile...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScene;