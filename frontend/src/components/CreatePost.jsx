import React, { useState } from "react";
import CreatePostModal from "./modals/CreatePostModal.jsx";
import { useTheme } from "../contexts/ThemeContext";
import { Plus } from 'lucide-react';

function CreatePost() {
    const { isDarkMode } = useTheme();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {/* Create Post Button */}
            <button
                onClick={() => setShowModal(true)}
                className={`
                    w-full sm:w-auto
                    flex items-center justify-center
                    px-4 py-2.5 rounded-lg
                    font-medium text-sm
                    transition-all duration-200 ease-in-out
                    shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-900'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 focus:ring-offset-white'
                }
                `}
            >
                <Plus className="w-5 h-5 mr-2" />
                <span>Create Post</span>
            </button>

            {/* Modal */}
            {showModal && (
                <CreatePostModal isDarkMode={isDarkMode} showModal={showModal} setShowModal={setShowModal} />
            )}
        </>
    );
}

export default CreatePost;

