import React from "react";
import { CheckCircle, Shield, Trash2 } from 'lucide-react';
import { ChatBubbleLeftRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/useChatStore.js";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useModalStore } from "../../store/useModalStore.js";
import { usePostStore } from "../../store/usePostStore.js";

const PostHeader = ({
                        user,
                        timestamp,
                        setShowDeleteConfirm,
                        postId,
                        isInProfile,
                        profileImageUrl
                    }) => {
    const { setSelectedUser } = useChatStore();
    const { role, authUser } = useAuthStore();
    const { toggleEditModal } = useModalStore();
    const { setPostToEditId } = usePostStore();
    const navigate = useNavigate();
    const isPostOwner = authUser._id === user._id;

    const handleEditClick = () => {
        setPostToEditId(postId);
        toggleEditModal();
    };

    const handleTalkToOwner = async (userToTalkTo) => {
        await setSelectedUser(userToTalkTo);
        navigate("/chat");
    };

    const handleNavigateToProfile = (userId) => {
        if (userId) navigate(`/profile/${userId}`);
    };

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigateToProfile(user._id)}>
                <div className="flex-shrink-0 mr-2">
                    <img
                        src={profileImageUrl}
                        alt={user.firstName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                </div>
                <div>
                    <h3 className="flex items-center font-semibold dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        {user.firstName + " " + user.lastName}
                        {user.role === "HouseOwner" && <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />}
                        {user.role === "admin" && <Shield className="h-4 w-4 ml-1 text-purple-500" />}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(timestamp).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {isPostOwner && (
                    <button
                        onClick={handleEditClick}
                        className="bg-green-600 text-white p-1.5 sm:p-2 rounded-md hover:bg-green-700 transition-colors"
                        title="Edit post"
                    >
                        <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                )}
                {(role === "admin" || isPostOwner) && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white p-1.5 sm:p-2 rounded-md hover:bg-red-700 transition-colors"
                        title="Delete post"
                    >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                )}

                {!isInProfile && !isPostOwner && (
                    <button
                        onClick={() => handleTalkToOwner(user)}
                        className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostHeader;