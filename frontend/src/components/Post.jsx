import React from 'react';
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ImageModal from './post/ImageModal';
import PostHeader from './post/PostHeader';
import PostDetails from './post/PostDetails';
import PostActions from './post/PostActions';
import usePost from './post/usePost';
import { renderStars } from './post/utils.jsx';
import ConfirmationModal from "./ConfirmationModal";
import EditPostModal from "./EditPostModal";
import ImageCarousel from "./ImageCarousel";

const Post = ({
                  user,
                  postId,
                  title,
                  content,
                  images = [],
                  price,
                  address,
                  elevator,
                  maximumCapacity,
                  avgRate,
                  timestamp,
                  isSavedInitially,
              }) => {
    const { role, authUser } = useAuthStore();
    const location = useLocation();
    const isInProfile = location.pathname === "/profile";
    const isInSaved = location.pathname === "/saved";
    const isInHome = location.pathname === "/";
    const isPostOwner = authUser._id === user._id;

    const BASE_URL = import.meta.env.VITE_PFP_URL;
    const profileImageUrl = user?.profilePhoto
        ? BASE_URL + user.profilePhoto
        : "/avatar.png";

    const {
        rating,
        userRating,
        hoverRating,
        imageModalOpen,
        currentImageIndex,
        showEditModal,
        isSaved,
        wasUnsaved,
        showDeleteConfirm,
        setHoverRating,
        setImageModalOpen,
        setCurrentImageIndex,
        setShowEditModal,
        setShowDeleteConfirm,
        handleSaveToggle,
        handleRatePost,
        handleDelete,
        handleTalkToOwner,
        handleNavigateToProfile,
        handlePreviousImage,
        handleNextImage
    } = usePost(postId, user, avgRate, isSavedInitially, isInSaved);

    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 w-full max-w-6xl mx-auto">
                <PostHeader
                    user={user}
                    timestamp={timestamp}
                    isPostOwner={isPostOwner}
                    role={role}
                    handleNavigateToProfile={handleNavigateToProfile}
                    handleEditClick={() => setShowEditModal(true)}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    handleTalkToOwner={handleTalkToOwner}
                    isInProfile={isInProfile}
                    profileImageUrl={profileImageUrl}
                />

                <h2 className="text-lg font-bold dark:text-gray-200 mb-2">{title}</h2>
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

                {imageModalOpen && (
                    <ImageModal
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                        imageSrc={images[currentImageIndex]}
                        onPrevious={handlePreviousImage}
                        onNext={handleNextImage}
                        hasNext={currentImageIndex < images.length - 1}
                        hasPrevious={currentImageIndex > 0}
                        totalImages={images.length}
                        currentIndex={currentImageIndex}
                    />
                )}

                <PostDetails
                    price={price}
                    address={address}
                    elevator={elevator}
                    maximumCapacity={maximumCapacity}
                    rating={rating}
                    renderStars={renderStars}
                />

                <PostActions
                    rating={rating}
                    userRating={userRating}
                    hoverRating={hoverRating}
                    handleRatePost={handleRatePost}
                    setHoverRating={setHoverRating}
                    handleSaveToggle={handleSaveToggle}
                    isSaved={isSaved}
                    isInSaved={isInSaved}
                    wasUnsaved={wasUnsaved}
                />
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => handleDelete(isInHome)}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
            />

            <EditPostModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                postId={postId}
            />
        </>
    );
};

export default Post;