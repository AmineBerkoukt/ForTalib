import React from 'react';
import { Users, MessageCircleMore } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext";
import { useChatStore } from "../store/useChatStore.js";
import SearchWithDropdown from "./SearchWithDropdown.jsx";
import { useAuthStore } from "../store/useAuthStore";

const SidebarHeader = ({ searchQuery, setSearchQuery }) => {
    const { isDarkMode } = useTheme();
    const baseClasses = isDarkMode ? 'border-gray-700' : 'border-gray-300';
    const { allUsers } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const searchBaseClasses = isDarkMode
        ? 'bg-gray-700 focus:bg-gray-600 text-gray-100'
        : 'bg-gray-100 focus:bg-gray-200 text-gray-900';

    return (
        <div className={`w-full p-3 ${baseClasses}`}>
            <div className="flex items-center justify-between gap-2">
                {/* Icon Section */}
                <div className="flex items-center gap-2">
                    <MessageCircleMore size={30} />
                    {/* Search Section */}
                    <SearchWithDropdown
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        users={allUsers}
                        baseClasses={searchBaseClasses}
                        onlineUsers={onlineUsers}
                    />
                </div>
            </div>
        </div>
    );
};

export default SidebarHeader;
