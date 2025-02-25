import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus } from "lucide-react";
import toast from "react-hot-toast";

const PostButtom = ({ postId, isSavedInitially, savePost, unsavePost, ratePost, avgRate }) => {
    const [rating, setRating] = useState(avgRate);
    const [isSaved, setIsSaved] = useState(isSavedInitially);

    const handleRatePost = async (newRating) => {
        try {
            await ratePost(newRating);
            setRating(newRating);
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    return (
        <div className="flex justify-between items-center border-t pt-2 mt-2">
            <div className="flex">
                {Array(5).fill().map((_, index) => (
                    <div key={index} onClick={() => handleRatePost(index + 1)}>
                        {index + 1 <= rating ? <StarIcon className="h-5 w-5 text-yellow-500" /> : <StarOutlineIcon className="h-5 w-5 text-yellow-500" />}
                    </div>
                ))}
            </div>

            <button onClick={() => setIsSaved(!isSaved)}>
                {isSaved ? <Bookmark className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
            </button>
        </div>
    );
};

export default PostButtom;
