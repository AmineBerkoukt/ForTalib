import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import PostDetailsModal from "./PostDetailsModal";
import {useModalStore} from "../store/useModalStore.js"; // Import the modal component

function RightBarPost({ posts }) {
    const { isDarkMode } = useTheme(); // Get dark mode state
    const [selectedPost, setSelectedPost] = useState(null); // Track selected post
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const { activateModal, disactivateModal } = useModalStore();



    const postList = posts?.posts || []; // Safely access the posts array

    if (!Array.isArray(postList) || postList.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                No top-rated posts available.
            </p>
        );
    }

    const openModal = (post) => {
        console.log("openModal", post);
        activateModal(post);
    };

    const closeModal = () => {
        disactivateModal();
    };

    return (
        <div className="space-y-4">
            {postList.map((post) => (
                <button
                    key={post._id}
                    onClick={() => openModal(post)}
                    className={`w-full text-left p-4 rounded-lg shadow-md transition-all ${
                        isDarkMode
                            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                            : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                >
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm">
                        <span className="font-medium">Owner:</span>{" "}
                        {post.user.firstName} {post.user.lastName}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Price:</span> {post.price} DHs
                    </p>
                </button>
            ))}
        </div>
    );
}

export default RightBarPost;
