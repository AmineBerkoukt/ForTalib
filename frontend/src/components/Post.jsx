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
import {useTheme} from "../contexts/ThemeContext.jsx";
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
    const [rating, setRating] = useState(avgRate);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isInProfile = location.pathname === "/profile";
    const isInSaved = location.pathname === "/saved";
    const isInHome = location.pathname === "/";
    const [isSaved, setIsSaved] = useState(isInSaved || isSavedInitially);
    const [wasUnsaved, setWasUnsaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isPostOwner = authUser._id === user._id;


    let profileImageUrl = user?.profilePhoto
        ? BASE_URL + user.profilePhoto
        : "/avatar.png";



    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const decimal = rating - fullStars
        const stars = [
            ...Array(fullStars)
                .fill(null)
                .map((_, index) => <StarIcon key={`full-${index}`} className="h-5 w-5 text-yellow-500" />),
        ]

        if (decimal > 0) {
            stars.push(
                <StarIcon
                    key="decimal"
                    className="h-5 w-5 text-yellow-500"
                    style={{
                        clipPath: `inset(0 ${100 - decimal * 100}% 0 0)`,
                    }}
                />,
            )
        }

        const emptyStars = 5 - stars.length
        stars.push(
            ...Array(emptyStars)
                .fill(null)
                .map((_, index) => <StarOutlineIcon key={`empty-${index}`} className="h-5 w-5 text-yellow-500" />),
        )

        return stars
    }

    const handleSaveToggle = async () => {
        try {
            if (isSaved) {
                await unsavePost(postId)
                if (isInSaved) {
                    setWasUnsaved(true)
                    toast.success("Post unsaved successfully. Click again to save.")
                } else {
                    toast.success("Post unsaved successfully.")
                }
            } else {
                await savePost(postId)
                if (isInSaved) {
                    setWasUnsaved(false)
                }
                toast.success("Post saved successfully.")
            }
            setIsSaved(!isSaved)
        } catch (error) {
            toast.error("An error occurred while saving the post.")
            console.error(error)
        }
    }

    const handleRatePost = async (newRating) => {
        try {
            if (!postId || typeof newRating !== "number" || newRating < 1 || newRating > 5) {
                throw new Error("Invalid rating value")
            }

            const rateResponse = await ratePost(postId, newRating);
            setRating(rateResponse.avgRate);
            setUserRating(newRating);
            toast.success(`You have given a rate of ${newRating} stars!`);

        } catch (error) {
            console.error("Rating error:", error)
            toast.error("Failed to submit rating. Please try again later.")
        }
    }

    const handleDelete = async () => {
        try {
            const userId = user._id
            await deletePost(postId, isInHome, userId)
            setShowDeleteConfirm(false)
            toast.success("Post deleted successfully")
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error("Failed to delete post")
        }
    }

    const handleTalkToOwner = async (userToTalkTo) => {
        setSelectedUser(userToTalkTo)
        navigate("/chat")
    }

    const handleNavigateToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`)
        }
    }

    const handleEditClick = () => {
        setShowEditModal(true)
    }

    const handleCloseModal = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setImageModalOpen(false)
        }
    }, [])

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                setImageModalOpen(false)
            }
        }

        if (imageModalOpen) {
            document.addEventListener("keydown", handleEscapeKey)
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [imageModalOpen])

    const ImageModal = ({ isOpen, onClose, imageSrc }) =>
        isOpen
            ? createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
                    onClick={handleCloseModal}
                >
                    <div className="relative w-full max-w-3xl h-full max-h-[80vh] flex items-center justify-center">
                        <button className="absolute top-2 right-2 text-white text-2xl font-bold z-10" onClick={onClose}>
                            &#x2715;
                        </button>
                        <img
                            src={imageSrc || "/placeholder.svg"}
                            alt="Enlarged Post"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>,
                document.body,
            )
            : null

    const getSaveButtonContent = () => {
        if (isInSaved) {
            if (wasUnsaved) {
                return (
                    <>
                        <BookmarkPlus className="h-5 w-5 mr-1" />
                        <span className="tooltip">Save</span>
                    </>
                )
            }
            return (
                <>
                    <Bookmark className="h-5 w-5 mr-1" />
                    <span className="tooltip">Unsave</span>
                </>
            )
        }

        return isSaved ? (
            <>
                <Bookmark className="h-5 w-5 mr-1" />
                <span className="tooltip">Unsave</span>
            </>
        ) : (
            <>
                <BookmarkPlus className="h-5 w-5 mr-1" />
                <span className="tooltip">Save</span>
            </>
        )
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 w-full max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center cursor-pointer" onClick={() => handleNavigateToProfile(user._id)}>
                        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-10 w-10 rounded-full mr-2" />
                        <div>
                            <h3 className="flex items-center font-semibold dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                                {user.name}
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
                                className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                                title="Edit post"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>
                        )}
                        {(role === "admin" || isPostOwner) && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                                title="Delete post"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}

                        {!isInProfile && !isPostOwner && (
                            <button
                                onClick={() => handleTalkToOwner(user)}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                <h2 className="text-lg font-bold dark:text-gray-200 mb-2">{title}</h2>
                <p className="mb-2 dark:text-gray-200">{content}</p>

                {images && images.length > 0 && (
                    <ImageCarousel
                        images={images}
                        currentImageIndex={currentImageIndex}
                        onImageClick={(index) => {
                            setCurrentImageIndex(index)
                            setImageModalOpen(true)
                        }}
                    />
                )}

                <ImageModal
                    isOpen={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    imageSrc={images && images.length > 0 ? images[currentImageIndex] : ""}
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="dark:text-gray-200">
                        <strong>Price:</strong> {price}
                    </div>
                    <div className="dark:text-gray-200">
                        <strong>Address:</strong> {address}
                    </div>
                    <div className="dark:text-gray-200">
                        <strong>Elevator:</strong> {elevator ? "Yes" : "No"}
                    </div>
                    <div className="dark:text-gray-200">
                        <strong>Max Capacity:</strong> {maximumCapacity}
                    </div>
                    <div className="dark:text-gray-200 flex items-center">
                        <strong>Rating:</strong>
                        <div className="flex ml-2">
                            {renderStars(rating)}
                            <small className="ml-1 text-gray-600 dark:text-gray-400">({rating.toFixed(1)})</small>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t dark:border-gray-700 pt-2 mt-2">
                    <div className="flex items-center text-gray-500">
                        <span className="mr-2">Rate this post:</span>
                        <div className="flex" onMouseLeave={() => setHoverRating(null)}>
                            {Array(5)
                                .fill()
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer transition-colors duration-150"
                                        onClick={() => handleRatePost(index + 1)}
                                        onMouseEnter={() => setHoverRating(index + 1)}
                                    >
                                        {index + 1 <= (hoverRating || userRating || rating) ? (
                                            <StarIcon className="h-5 w-5 text-yellow-500 hover:text-yellow-600" />
                                        ) : (
                                            <StarOutlineIcon className="h-5 w-5 text-yellow-500 hover:text-yellow-600" />
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveToggle}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                        {getSaveButtonContent()}
                    </button>
                </div>
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
    )
}

export default Post
