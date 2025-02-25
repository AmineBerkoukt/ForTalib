import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon, ChatBubbleLeftRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus, CheckCircle, Shield, Trash2 } from 'lucide-react';
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
import PostButtom from "./post/PostButtom.jsx"; // Import the new component

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
                  avgRate,
                  timestamp,
                  isSavedInitially,
              }) => {
    const { isDarkMode } = useTheme();
    const { setSelectedUser } = useChatStore();
    const { role, authUser } = useAuthStore();
    const { savePost, unsavePost, ratePost, deletePost } = usePostStore();
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isInProfile = location.pathname === "/profile";
    const isInSaved = location.pathname === "/saved";
    const isInHome = location.pathname === "/";
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isPostOwner = authUser._id === user._id;

    let profileImageUrl = user?.profilePhoto ? `${BASE_URL + user.profilePhoto}` : "/avatar.png";

    const handleDelete = async () => {
        try {
            const userId = user._id;
            await deletePost(postId, isInHome, userId);
            setShowDeleteConfirm(false);
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const handleNavigateToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setImageModalOpen(false);
        }
    }, []);

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                setImageModalOpen(false);
            }
        };

        if (imageModalOpen) {
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [imageModalOpen]);

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
                    handleEditClick={handleEditClick}
                    isInProfile={isInProfile}
                    profileImageUrl={profileImageUrl}
                />

                {/*Content and Title */}
                <h2 className="mt-4 text-lg font-bold dark:text-gray-200 mb-2">{title}</h2>
                <p className="mb-2 dark:text-gray-200">{content}</p>

                {images && images.length > 0 && (
                    <ImageCarousel
                        images={images}
                        currentImageIndex={currentImageIndex}
                        onImageClick={(index) => {
                            setCurrentImageIndex(index);
                            setImageModalOpen(true);
                        }}
                    />
                )}

                <ImageModal
                    isOpen={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    images={images}
                    initialIndex={currentImageIndex}
                />

                <PostDetails
                    price={price}
                    address={address}
                    elevator={elevator}
                    maximumCapacity={maximumCapacity}
                    rating={avgRate}
                    renderStars={(rating) => {
                        const fullStars = Math.floor(rating);
                        const decimal = rating - fullStars;
                        const stars = [
                            ...Array(fullStars)
                                .fill(null)
                                .map((_, index) => (
                                    <StarIcon key={`full-${index}`} className="h-5 w-5 text-yellow-500" />
                                )),
                        ];

                        if (decimal > 0) {
                            stars.push(
                                <StarIcon
                                    key="decimal"
                                    className="h-5 w-5 text-yellow-500"
                                    style={{
                                        clipPath: `inset(0 ${100 - decimal * 100}% 0 0)`,
                                    }}
                                />
                            );
                        }

                        const emptyStars = 5 - stars.length;
                        stars.push(
                            ...Array(emptyStars)
                                .fill(null)
                                .map((_, index) => (
                                    <StarOutlineIcon key={`empty-${index}`} className="h-5 w-5 text-yellow-500" />
                                ))
                        );

                        return stars;
                    }}
                />

                {/* The bottom section */}
                <PostButtom
                    postId={postId}
                    isSavedInitially={isSavedInitially}
                    isInSaved={isInSaved}
                    savePost={savePost}
                    unsavePost={unsavePost}
                    ratePost={ratePost}
                    avgRate={avgRate}
                />
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
            />

            <EditPostModal
                isDarkMode={isDarkMode}
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                postId={postId}
            />
        </>
    );
};

export default Post;