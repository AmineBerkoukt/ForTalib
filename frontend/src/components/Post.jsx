import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import EditPostModal from "./modals/EditPostModal.jsx";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore.js";
import ConfirmationModal from "./modals/ConfirmationModal.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ImageModal from "./post/ImageModal.jsx";
import PostDetails from "./post/PostDetails.jsx";
import PostHeader from "./post/PostHeader.jsx";
import PostButtom from "./post/PostButtom.jsx";

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
                  isSavedInitially,
              }) => {
    const { isDarkMode } = useTheme();
    const { role, authUser } = useAuthStore();
    const { savePost, unsavePost, ratePost, deletePost } = usePostStore();
    const [avgRate, setAvgRate] = useState(initialAvgRate);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isPostOwner = authUser._id === user._id;

    let profileImageUrl = user.profilePhoto ? BASE_URL + user.profilePhoto : "./avatar.png";

    if (profileImageUrl !== "./avatar.png") {
        profileImageUrl = BASE_URL + user.profilePhoto;
    }

    const handleDelete = async () => {
        try {
            await deletePost(postId);
            setShowDeleteConfirm(false);
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleNavigateToProfile = (userId) => {
        if (userId) navigate(`/profile/${userId}`);
    };



    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 w-full max-w-6xl mx-auto">
                <PostHeader
                    user={user}
                    timestamp={timestamp}
                    isPostOwner={isPostOwner}
                    role={role}
                    handleNavigateToProfile={handleNavigateToProfile}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    handleEditClick={() => setShowEditModal(true)}
                    profileImageUrl={profileImageUrl}
                />

                <h2 className="mt-4 text-lg font-bold dark:text-gray-200 mb-2">{title}</h2>
                <p className="mb-2 dark:text-gray-200">{content}</p>

                {images?.length > 0 && (
                    <ImageCarousel
                        images={images}
                        currentImageIndex={currentImageIndex}
                        onImageClick={(index) => {
                            setCurrentImageIndex(index);
                            setImageModalOpen(true);
                        }}
                    />
                )}

                <ImageModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} images={images} />

                <PostDetails price={price} address={address} elevator={elevator} maximumCapacity={maximumCapacity} rating={avgRate} />

                <PostButtom postId={postId} isSavedInitially={isSavedInitially} avgRate={avgRate} />
            </div>

            <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title="Delete Post" message="Are you sure you want to delete this post?" confirmText="Delete" />

            <EditPostModal isDarkMode={isDarkMode} showModal={showEditModal} setShowModal={setShowEditModal} postId={postId} />
        </>
    );
};

export default Post;
