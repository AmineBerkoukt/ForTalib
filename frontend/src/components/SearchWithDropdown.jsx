import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useChatStore } from "../store/useChatStore";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const SearchWithDropdown = ({ searchQuery, setSearchQuery, baseClasses, onlineUsers }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const { getMessages, setSelectedUser, allUsers: users } = useChatStore();

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUserSelect = async (user) => {
        // First set the selected user
        setSelectedUser(user);
        // Then load their messages
        await getMessages(user._id);
        // Clean up the search UI
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const handleKeyDown = (e) => {
        if (!isDropdownOpen || filteredUsers.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredUsers.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prevIndex) => (prevIndex - 1 + filteredUsers.length) % filteredUsers.length);
                break;
            case 'Enter':
                e.preventDefault();
                handleUserSelect(filteredUsers[highlightedIndex]);
                break;
            case 'Escape':
                setIsDropdownOpen(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className="relative w-full">
            <div className="relative" ref={inputRef}>
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4"
                    aria-hidden="true"
                />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${baseClasses} 
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm`}
                    aria-label="Search users"
                />
            </div>
            {isDropdownOpen && searchQuery && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    role="listbox"
                >
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => {
                            // Get profile picture for each individual user
                            const profilePicture = user.profilePhoto ? BASE_URL + user.profilePhoto : "./avatar.png";

                            return (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors 
                                    ${highlightedIndex === index ? 'bg-gray-100 dark:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                    role="option"
                                >
                                    <div className="relative">
                                        <img
                                            src={profilePicture}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        {onlineUsers.includes(user._id) && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-700" />
                                        )}
                                    </div>
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchWithDropdown;