"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline"
import { Bookmark, BookmarkPlus } from "lucide-react"
import toast from "react-hot-toast"
import { usePostStore } from "../../store/usePostStore.js"
import { useSavedPostStore } from "../../store/useSavedPostStore.js"

const PostBottom = ({ postId, avgRate }) => {
    const location = useLocation()
    const { savePost, unsavePost, ratePost } = usePostStore()
    const { getSavedPostsIds, savedPostsIds } = useSavedPostStore()
    const [rating, setRating] = useState(avgRate)
    const [isSaved, setIsSaved] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        getSavedPostsIds()
    }, [getSavedPostsIds])

    useEffect(() => {
        setIsSaved(savedPostsIds.includes(postId))
    }, [savedPostsIds, postId])

    useEffect(() => {
        if (location.pathname === "/saved") {
            setIsSaved(true)
        }
    }, [location.pathname])

    const handleRatePost = async (newRating) => {
        try {
            const rateResponse = await ratePost(postId, newRating)
            setRating(rateResponse.avgRate)
            toast.success(`You rated this post ${newRating} stars!`)
        } catch (error) {
            toast.error("Failed to submit rating")
        }
    }

    const handleSaveUnsave = async () => {
        try {
            if (isSaved) {
                await unsavePost(postId)
                setIsSaved(false)
                toast.success("Post unsaved successfully")
            } else {
                await savePost(postId)
                setIsSaved(true)
                toast.success("Post saved successfully")
            }
        } catch (error) {
            toast.error("Failed to save/unsave post")
        }
    }

    return (
        <div className="flex justify-between items-center border-t pt-2 mt-2 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
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
                                <StarIcon className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <StarOutlineIcon className="h-5 w-5 text-yellow-500" />
                            )}
                        </div>
                    ))}
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
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        active:scale-95
                        ${
                        isSaved
                            ? "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                            : "text-gray-600 hover:text-gray-800 bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                    }
                    `}
                >
                    <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                    {isSaved ? (
                        <Bookmark className={`h-5 w-5 ${isHovering ? "text-red-500 animate-pulse" : ""}`} />
                    ) : (
                        <BookmarkPlus className="h-5 w-5" />
                    )}
                </button>
                {isHovering && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700 whitespace-nowrap z-10">
                        {isSaved ? "Unsave post" : "Save post"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostBottom

