import { StarIcon, StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Bookmark, BookmarkPlus } from 'lucide-react';

const PostActions = ({
                         rating,
                         userRating,
                         hoverRating,
                         handleRatePost,
                         setHoverRating,
                         handleSaveToggle,
                         isSaved,
                         isInSaved,
                         wasUnsaved
                     }) => {
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

export default PostActions;