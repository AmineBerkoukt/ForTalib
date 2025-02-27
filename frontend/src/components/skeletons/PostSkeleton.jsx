import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const PostSkeleton = () => {
    const { isDarkMode } = useTheme();

    return (
        <div
            className={`rounded-xl overflow-hidden shadow-md animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
            {/* Post header skeleton */}
            <div className="p-4">
                <div className="flex items-center space-x-3">
                    {/* User avatar skeleton */}
                    <div
                        className={`w-10 h-10 rounded-full ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>

                    {/* User name and timestamp skeleton */}
                    <div className="flex-1">
                        <div
                            className={`h-4 w-24 rounded ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                        ></div>
                        <div
                            className={`h-3 w-16 mt-2 rounded ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Post title skeleton */}
            <div
                className={`h-6 mx-4 rounded ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
            ></div>

            {/* Post content skeleton */}
            <div className="p-4 space-y-2">
                <div
                    className={`h-4 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                ></div>
                <div
                    className={`h-4 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                ></div>
                <div
                    className={`h-4 w-3/4 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                ></div>
            </div>

            {/* Post image skeleton */}
            <div
                className={`w-full h-48 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
            ></div>

            {/* Post details skeleton */}
            <div className="p-4 space-y-2">
                <div className="flex justify-between">
                    <div
                        className={`h-4 w-20 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`h-4 w-20 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                </div>
                <div className="flex justify-between">
                    <div
                        className={`h-4 w-24 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`h-4 w-16 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                </div>
            </div>

            {/* Post actions skeleton */}
            <div
                className={`p-4 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                }`}
            >
                <div className="flex justify-around">
                    <div
                        className={`h-8 w-20 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`h-8 w-20 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`h-8 w-20 rounded ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PostSkeleton;