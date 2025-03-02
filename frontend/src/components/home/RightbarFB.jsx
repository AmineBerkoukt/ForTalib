import React from "react";
import RightBarPost from "./RightbarPost.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { usePostStore } from "../../store/usePostStore.js";

function RightbarFb() {
    const { isDarkMode } = useTheme();
    const { topFivePosts, getTopFive } = usePostStore();

    React.useEffect(() => {
        getTopFive();
    }, [getTopFive]);

    return (
        <div className="w-full lg:w-64 h-full">
            <div 
                className={`
                    sticky top-[60px] h-[calc(100vh-60px)] 
                    bg-white dark:bg-gray-800 rounded-lg shadow-md 
                    overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                    ${isDarkMode ? 'dark' : ''}
                `}
            >
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-4 dark:text-gray-200">
                        Top Rated Posts
                    </h2>
                    <div className="space-y-4">
                        <RightBarPost posts={topFivePosts} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightbarFb;