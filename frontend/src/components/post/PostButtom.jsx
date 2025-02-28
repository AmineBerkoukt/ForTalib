import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../../store/usePostStore.js";
import { useSavedPostStore } from "../../store/useSavedPostStore.js";

const PostBottom = ({ postId, avgRate, updateAvgRate }) => {
    const { savePost, unsavePost, ratePost } = usePostStore();
    const { getSavedPostsIds, savedPostsIds } = useSavedPostStore();
    const [rating, setRating] = useState(avgRate);
    const [isSaved, setIsSaved] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isRatingHovered, setIsRatingHovered] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isRatingAnimating, setIsRatingAnimating] = useState(false);

    // Load saved posts IDs when component mounts
    useEffect(() => {
        getSavedPostsIds();
    }, [getSavedPostsIds]);

    // Update isSaved state when savedPostsIds changes
    useEffect(() => {
        setIsSaved(savedPostsIds.includes(postId));
    }, [savedPostsIds, postId]);

    const handleRatePost = async (newRating) => {
        try {
            setIsRatingAnimating(true);
            const rateResponse = await ratePost(postId, newRating);
            setRating(rateResponse.avgRate); // Local state
            updateAvgRate(rateResponse.avgRate); // Update parent state
            toast.success(`You rated this post ${newRating} stars!`, {
                icon: '⭐',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            setTimeout(() => setIsRatingAnimating(false), 600);
        } catch (error) {
            toast.error("Failed to submit rating");
            setIsRatingAnimating(false);
        }
    };

    const handleSaveUnsave = async () => {
        try {
            if (isSaved) {
                await unsavePost(postId);
                setIsSaved(false);
                toast.success("Post unsaved successfully", {
                    icon: '🗑️',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } else {
                await savePost(postId);
                setIsSaved(true);
                toast.success("Post saved successfully", {
                    icon: '📌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error("Failed to save/unsave post");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center border-t dark:border-gray-600 pt-3 mt-2 transition-all duration-300 group-hover:opacity-100 opacity-90">
            <div
                className="flex items-center mb-2 sm:mb-0 relative"
                onMouseEnter={() => setIsRatingHovered(true)}
                onMouseLeave={() => {
                    setIsRatingHovered(false);
                    setHoveredRating(0);
                }}
            >
                <div className="flex">
                    {Array(5)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={() => handleRatePost(index + 1)}
                                onMouseEnter={() => setHoveredRating(index + 1)}
                                className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
                                    isRatingAnimating ? 'animate-pulse' : ''
                                }`}
                                aria-label={`Rate ${index + 1} stars`}
                            >
                                {(hoveredRating > 0 ? index + 1 <= hoveredRating : index + 1 <= rating) ? (
                                    <StarIcon className={`h-6 w-6 text-yellow-500 dark:text-yellow-400 ${
                                        isRatingAnimating ? 'animate-bounce' : ''
                                    }`} />
                                ) : (
                                    <StarOutlineIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                                )}
                            </div>
                        ))}
                </div>

                {isRatingHovered && (
                    <div className="absolute -top-8 left-0 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-800 whitespace-nowrap z-10">
                        {hoveredRating > 0 ? `Rate ${hoveredRating} stars` : `Current rating: ${rating}`}
                        <div className="absolute top-full left-4 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                    </div>
                )}
            </div>

            <div className="relative">
                <button
                    onClick={handleSaveUnsave}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    aria-label={isSaved ? "Unsave post" : "Save post"}
                    className={`
            flex items-center gap-2 px-3 py-2 rounded-md
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700
            active:scale-95
            ${
                        isSaved
                            ? "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                            : "text-gray-600 hover:text-gray-800 bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                    }
          `}
                >
                    <span className="hidden sm:inline text-sm font-medium">{isSaved ? "Saved" : "Save"}</span>
                    {isSaved ? (
                        <Bookmark className={`h-5 w-5 ${isHovering ? "text-red-500 animate-pulse" : ""}`} />
                    ) : (
                        <BookmarkPlus className="h-5 w-5" />
                    )}
                </button>
                {isHovering && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-800 whitespace-nowrap z-10">
                        {isSaved ? "Unsave post" : "Save post"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostBottom;