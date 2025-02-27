import React from "react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useModalStore } from "../../store/useModalStore.js";

function RightBarPost({ posts }) {
    const { isDarkMode } = useTheme();
    const { activateModal } = useModalStore();

    const postList = posts?.posts || [];

    if (!Array.isArray(postList) || postList.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                No top-rated posts available.
            </p>
        );
    }

    const openModal = (post) => {
        activateModal(post);
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
