import React, {useEffect} from 'react';
import UserItem from './UserItem.jsx';

const UserList = ({ processedUsers, onlineUsers, selectedUser, setSelectedUser, isDarkMode }) => {
    useEffect(() => {

    }, [processedUsers]);

    return (
        <div className="overflow-y-auto w-full py-1 flex flex-col items-center">
            {processedUsers.map((userItem) => (
                <UserItem
                    key={userItem._id}
                    user={userItem.user}
                    onlineUsers={onlineUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    isDarkMode={isDarkMode}
                />
            ))}
        </div>
    );
};

export default UserList;
