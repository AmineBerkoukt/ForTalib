import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../../store/usePostStore';
import { useChatStore } from '../../store/useChatStore';
import toast from 'react-hot-toast';

export const usePost = (postId, user, avgRate, isSavedInitially, isInSaved) => {
    const navigate = useNavigate();
    const { setSelectedUser } = useChatStore();
    const { savePost, unsavePost, ratePost, deletePost } = usePostStore();

    const [rating, setRating] = useState(avgRate);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isSaved, setIsSaved] = useState(isInSaved || isSavedInitially);
    const [wasUnsaved, setWasUnsaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSaveToggle = async () => {
        try {
            if (isSaved) {
                await unsavePost(postId);
                if (isInSaved) {
                    setWasUnsaved(true);
                    toast.success("Post unsaved successfully. Click again to save.");
                } else {
                    toast.success("Post unsaved successfully.");
                }
            } else {
                await savePost(postId);
                if (isInSaved) {
                    setWasUnsaved(false);
                }
                toast.success("Post saved successfully.");
            }
            setIsSaved(!isSaved);
        } catch (error) {
            toast.error("An error occurred while saving the post.");
            console.error(error);
        }
    };

    const handleRatePost = async (newRating) => {
        try {
            if (!postId || typeof newRating !== 'number' || newRating < 1 || newRating > 5) {
                throw new Error("Invalid rating value");
            }
            const rateResponse = await ratePost(postId, newRating);
            setRating(rateResponse.avgRate);
            setUserRating(newRating);
            toast.success(`You have given a rate of ${newRating} stars!`);
        } catch (error) {
            console.error("Rating error:", error);
            toast.error("Failed to submit rating. Please try again later.");
        }
    };

    const handleDelete = async (isInHome) => {
        try {
            let userId = user._id;
            await deletePost(postId, isInHome, userId);
            setShowDeleteConfirm(false);
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const handleTalkToOwner = async (userToTalkTo) => {
        setSelectedUser(userToTalkTo);
        navigate("/chat");
    };

    const handleNavigateToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, images?.length - 1 || 0));
    };

    return {
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
    };
};

export default usePost;