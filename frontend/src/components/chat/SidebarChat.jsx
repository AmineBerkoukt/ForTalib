import React, { useEffect, useState, useMemo } from 'react';
import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import SidebarSkeleton from "../skeletons/SidebarSkeleton.jsx";
import SidebarHeader from '../SidebarHeader.jsx';
import SearchAndFilters from '../SearchAndFilters.jsx';
import UserList from './UserList.jsx';
import EmptyState from '../EmptyState.jsx';
import { useTheme } from "../../contexts/ThemeContext.jsx";

const SidebarChat = ({ isWider, isHidden }) => {
    const {
        getAllUsers,
        allUsers,
        usersForSidebar,
        getUsersForSidebar,
        selectedUser,
        setSelectedUser,
        isUsersLoading,
    } = useChatStore();
    const { onlineUsers, authUser } = useAuthStore();
    const { isDarkMode } = useTheme();
    const baseClass = isDarkMode ? 'border-gray-700' : 'border-gray-300';

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('status');

    useEffect(() => {
        getAllUsers();
        getUsersForSidebar();
    }, [getAllUsers, getUsersForSidebar]);

    const processedUsers = useMemo(() => {
        let filtered = allUsers.filter((user) => user._id !== authUser?._id);

        if (searchQuery) {
            filtered = filtered.filter(user =>
                `${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }

        if (showOnlineOnly) {
            filtered = filtered.filter(user => onlineUsers.includes(user._id));
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'status') {
                const aOnline = onlineUsers.includes(a._id);
                const bOnline = onlineUsers.includes(b._id);
                if (aOnline !== bOnline) return bOnline ? 1 : -1;
            }
            return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        });
    }, [allUsers, authUser, onlineUsers, showOnlineOnly, searchQuery, sortBy]);

    const baseClasses = isDarkMode
        ? 'bg-gray-800 border-gray-700 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900';

    if (isUsersLoading) return <SidebarSkeleton />;

    if (isHidden) return null;

    return (
        <aside className={`h-full border-r flex flex-col ${baseClass} ${baseClasses} ${
            isWider ? 'w-full sm:w-1/2 md:w-1/3 lg:w-4/12' : 'w-full sm:w-1/3 md:w-1/4 lg:w-3/12'
        } transition-all duration-400 ease-in-out`}>
            <SidebarHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className={`h-px w-full my-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

            <UserList
                processedUsers={usersForSidebar}
                onlineUsers={onlineUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                isDarkMode={isDarkMode}
            />
        </aside>
    );
};

export default SidebarChat;

