import React, { useState, useEffect, useRef } from "react";
import { Settings, Pencil, Trash2, Lock } from 'lucide-react';

export default function ProfileDropdown({ isDarkMode, onEditClick, onDeleteClick, toggleDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Profile menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Settings className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
                     style={{
                         transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                         opacity: isOpen ? 1 : 0,
                         transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
                     }}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEditClick();
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 ${
                            isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        } transition-colors duration-200`}
                    >
                        <Pencil className="w-4 h-4 flex-shrink-0"/>
                        <span>Edit Profile</span>
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEditClick();
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 ${
                            isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        } transition-colors duration-200`}
                    >
                        <Lock className="w-4 h-4 flex-shrink-0"/>
                        <span>Change Password</span>
                    </button>


                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDeleteClick();
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 text-red-500 hover:text-red-600 ${
                            isDarkMode ? 'hover:bg-gray-700 border-t border-gray-700' : 'hover:bg-gray-50 border-t border-gray-200'
                        } transition-colors duration-200`}
                    >
                        <Trash2 className="w-4 h-4 flex-shrink-0"/>
                        <span>Delete Account</span>
                    </button>
                </div>
            )}
        </div>
    );
}