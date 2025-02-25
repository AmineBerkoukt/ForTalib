import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus } from "lucide-react";
import toast from "react-hot-toast";

export const PostButtom = ({
                               postId,
                               isSavedInitially,
                               isInSaved,
                               savePost,
                               unsavePost,
                               ratePost,
                               avgRate,
                           }) => {
    const [rating, setRating] = useState(avgRate);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [isSaved, setIsSaved] = useState(isInSaved || isSavedInitially);
    const [wasUnsaved, setWasUnsaved] = useState(false);

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
            if (!postId || typeof newRating !== "number" || newRating < 1 || newRating > 5) {
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

    const getSaveButtonContent = () => {
        if (isInSaved) {
            if (wasUnsaved) {
                return (
                    <>
                        <BookmarkPlus className="h-5 w-5 mr-1" />
                        <span className="tooltip">Save</span>
                    </>
                );
            }
            return (
                <>
                    <Bookmark className="h-5 w-5 mr-1" />
                    <span className="tooltip">Unsave</span>
                </>
            );
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
        );
    };

    return (
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
    );
};

export default PostButtom;