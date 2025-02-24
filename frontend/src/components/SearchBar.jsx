import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearchStore } from "../store/useSearchStore.js";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const SearchBar = ({ className }) => {
    const { searchResult, isSearching, searchUser } = useSearchStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            setIsDropdownOpen(true);
            await searchUser(value);
        } else {
            setIsDropdownOpen(false);
        }
    };

    const handleSearchClick = (userId) => {
        setIsDropdownOpen(false);
        navigate(`/profile/${userId}`);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users"
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full bg-gray-100 dark:bg-gray-700 py-2 pl-10 pr-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 text-sm"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            {isDropdownOpen && searchTerm && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {isSearching ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Searching...
                        </div>
                    ) : searchResult.length > 0 ? (
                        searchResult.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleSearchClick(user._id)}
                            >
                                <img
                                    src={BASE_URL+ user.profilePhoto || 'https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg';
                                    }}
                                />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        ))
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

export default SearchBar;