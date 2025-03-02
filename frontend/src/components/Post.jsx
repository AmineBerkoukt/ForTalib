import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";
import EditPostModal from "./modals/EditPostModal.jsx";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore.js";
import ConfirmationModal from "./modals/ConfirmationModal.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ImageModal from "./post/ImageModal.jsx";
import PostDetails from "./post/PostDetails.jsx";
import PostHeader from "./post/PostHeader.jsx";
import PostBottom from "./post/PostButtom.jsx";
import { useModalStore } from "../store/useModalStore.js";

const BASE_URL = import.meta.env.VITE_PFP_URL;

const Post = ({
                  user,
                  postId,
                  title,
                  content,
                  images,
                  price,
                  address,
                  elevator,
                  maximumCapacity,
                  avgRate: initialAvgRate,
                  timestamp,
              }) => {
    const { isDarkMode } = useTheme();
    const { deletePost, getPosts, getTopFive } = usePostStore();
    const [avgRate, setAvgRate] = useState(initialAvgRate);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { toggleEditModal } = useModalStore();
        
    let profileImageUrl = user.profilePhoto ? BASE_URL + user.profilePhoto : "/avatar.png";

    if (profileImageUrl !== "/avatar.png") {
        profileImageUrl = BASE_URL + user.profilePhoto;
    }

    const updateAvgRate = (newRate) => {
        setAvgRate(newRate);
    };
    const handleDelete = async () => {
        try {
            await deletePost(postId);
            await getPosts();
            await getTopFive();
            setShowDeleteConfirm(false);
            toast.success("Post deleted successfully", {
                icon: '🗑️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };
    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-4 w-full max-w-6xl mx-auto overflow-hidden group">
                <PostHeader
                    user={user}
                    profileImageUrl={profileImageUrl}
                    timestamp={timestamp}
                    postId={postId}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    handleEditClick={() => toggleEditModal()}
                />

                <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h2>
                <p className="mb-3 text-gray-700 dark:text-gray-300">{content}</p>

                {images?.length > 0 && (
                    <div className="my-4 overflow-hidden rounded-lg">
                        <ImageCarousel
                            images={images}
                            currentImageIndex={currentImageIndex}
                            onImageClick={(index) => {
                                setCurrentImageIndex(index);
                                setImageModalOpen(true);
                            }}
                        />
                    </div>
                )}

                <ImageModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} images={images} />

                <PostDetails
                    price={price}
                    address={address}
                    elevator={elevator}
                    maximumCapacity={maximumCapacity}
                    rating={avgRate}
                />

                <PostBottom
                    postId={postId}
                    avgRate={avgRate}
                    updateAvgRate={updateAvgRate}
                />
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post ?"
                confirmText="Delete"
            />

            <EditPostModal isDarkMode={isDarkMode} postId={postId} />
        </>
    );
};

export default Post;