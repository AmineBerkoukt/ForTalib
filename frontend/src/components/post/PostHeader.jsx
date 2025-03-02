import React from "react";
import {CheckCircle, Shield} from 'lucide-react';
import {ChatBubbleLeftRightIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {Trash2} from 'lucide-react';
import {useChatStore} from "../../store/useChatStore.js";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/useAuthStore.js";
import {useModalStore} from "../../store/useModalStore.js";
import {usePostStore} from "../../store/usePostStore.js";

const PostHeader = ({
                        user,
                        timestamp,
                        setShowDeleteConfirm,
                        postId,
                        isInProfile,
                        profileImageUrl
                    }) => {
    const {setSelectedUser} = useChatStore();
    const {role, authUser} = useAuthStore();
    const {toggleEditModal} = useModalStore();
    const {setPostToEditId} = usePostStore();
    const navigate = useNavigate();
    const isPostOwner = authUser._id === user._id;

    const handleEditClick = () => {
        setPostToEditId(postId);
        toggleEditModal();
    }

    const handleTalkToOwner = async (userToTalkTo) => {
        setSelectedUser(userToTalkTo);
        navigate("/chat");
    };

    const handleNavigateToProfile = (userId) => {
        if (userId) navigate(`/profile/${userId}`);
    };
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigateToProfile(user._id)}>
                <img
                    src={profileImageUrl}
                    alt={user.firstName} className="h-10 w-10 rounded-full mr-2"/>
                <div>
                    <h3 className="flex items-center font-semibold dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        {user.firstName + " " + user.lastName}
                        {user.role === "HouseOwner" && <CheckCircle className="h-4 w-4 ml-1 text-blue-500"/>}
                        {user.role === "admin" && <Shield className="h-4 w-4 ml-1 text-purple-500"/>}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(timestamp).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {isPostOwner && (
                    <button
                        onClick={handleEditClick}
                        className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                        title="Edit post"
                    >
                        <PencilSquareIcon className="h-5 w-5"/>
                    </button>
                )}
                {(role === "admin" || isPostOwner) && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                        title="Delete post"
                    >
                        <Trash2 className="h-5 w-5"/>
                    </button>
                )}

                {!isInProfile && !isPostOwner && (
                    <button
                        onClick={() => handleTalkToOwner(user)}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-white"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostHeader;