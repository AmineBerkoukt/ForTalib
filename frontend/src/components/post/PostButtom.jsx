import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../../store/usePostStore.js";

const PostButtom = ({ postId, isSavedInitially, avgRate }) => {
    const location = useLocation();
    const { savePost, unsavePost, ratePost } = usePostStore();
    const [rating, setRating] = useState(avgRate);
    const [isSaved, setIsSaved] = useState(isSavedInitially);

    // If the user is on the /saved route, mark the post as saved by default
    useEffect(() => {
        if (location.pathname === "/saved") {
            setIsSaved(true);
        }
    }, [location.pathname]);

    const handleRatePost = async (newRating) => {
        try {
            const rateResponse = await ratePost(postId, newRating);
            setRating(rateResponse.avgRate);
            toast.success(`You rated this post ${newRating} stars!`);
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    const handleSaveUnsave = async () => {
        try {
            if (isSaved) {
                await unsavePost(postId);
                setIsSaved(false);
                toast.success("Post unsaved successfully");
            } else {
                await savePost(postId);
                setIsSaved(true);
                toast.success("Post saved successfully");
            }
        } catch (error) {
            toast.error("Failed to save/unsave post");
        }
    };

    return (
        <div
            className="flex justify-between items-center border-t pt-2 mt-2 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
            <div className="flex">
                {Array(5)
                    .fill()
                    .map((_, index) => (
                        <div
                            key={index}
                            onClick={() => handleRatePost(index + 1)}
                            className="cursor-pointer transition-transform duration-300 hover:scale-125"
                        >
                            {index + 1 <= rating ? (
                                <StarIcon className="h-5 w-5 text-yellow-500"/>
                            ) : (
                                <StarOutlineIcon className="h-5 w-5 text-yellow-500"/>
                            )}
                        </div>
                    ))}
            </div>

            <button
                onClick={handleSaveUnsave}
                className={`flex items-center gap-1 transition-all duration-300 hover:scale-105 ${
                    isSaved ? "text-blue-600 hover:text-blue-800" : "text-gray-600 hover:text-gray-800"
                }`}
            >
                {isSaved ? (
                    <>
                        <span>Unsave</span>
                        <Bookmark className="h-5 w-5"/>
                    </>
                ) : (
                    <>
                        <span>Save</span>
                        <BookmarkPlus className="h-5 w-5"/>
                    </>
                )}
            </button>

        </div>
    );
};

export default PostButtom;
