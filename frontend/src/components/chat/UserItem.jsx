import React from 'react';
const BASE_URL = import.meta.env.VITE_PFP_URL;

const UserItem = ({ user, onlineUsers, selectedUser, setSelectedUser, isDarkMode }) => {
    return (
        <button
            onClick={() => setSelectedUser(user)}
            className={`w-full sm:w-11/12 p-2 sm:p-4 flex items-center gap-2 sm:gap-4 transition-all duration-200 transform hover:scale-[1.02] 
            rounded-lg
            ${isDarkMode
                ? 'hover:bg-gray-700 active:bg-gray-600'
                : 'hover:bg-gray-200 active:bg-gray-300'
            }
            ${selectedUser?._id === user._id
                ? isDarkMode
                    ? "bg-gray-700 ring-1 ring-blue-400"
                    : "bg-blue-100 ring-1 ring-blue-500"
                : ""
            }`}
        >
            {/* User Avatar with Online Status */}
            <div className="relative group">
                <img
                    src={BASE_URL + user.profilePhoto || "/avatar.png"}
                    alt={user.firstName}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full transition-transform duration-200 group-hover:scale-105"
                />
                {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full
                    ring-2 ring-gray-800 dark:ring-gray-900 animate-pulse" />
                )}
            </div>

            {/* User Info */}
            <div className="text-left min-w-0 flex-1">
                <div className="font-medium truncate text-sm sm:text-base">
                    {user.firstName} {user.lastName}
                </div>
                <div className={`text-xs sm:text-sm flex items-center gap-1 ${
                    user.isOnline ? 'text-green-500' : 'text-gray-400'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {user.isOnline ? "Online" : "Offline"}
                </div>
            </div>
        </button>
    );
};

export default UserItem;

