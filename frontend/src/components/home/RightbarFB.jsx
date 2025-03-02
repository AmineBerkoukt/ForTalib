import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar.jsx";
import RightBarPost from "./RightbarPost.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx"; // Import ThemeContext
import { usePostStore } from "../../store/usePostStore.js"; // Import the Zustand store

function RightbarFb() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const { isDarkMode } = useTheme(); // Get dark mode state
    const { topFivePosts, getTopFive } = usePostStore(); // Access Zustand store

    // Fetch top-rated posts on mount
    useEffect(() => {
        getTopFive();
    }, [getTopFive]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const slideOffset = Math.min(scrollPosition, 32); // Limit max offset

    return (
        <div className={`mt-0.5 flex flex-col gap-4 ${isDarkMode ? "dark" : ""}`}>
            <div className="flex flex-col gap-4 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {/* SearchBar Sticky */}
                <div
                    className={`fixed w-full lg:w-72 ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg shadow-md p-4 z-20 transition-transform duration-200`}
                    style={{
                        transform: `translateY(-${slideOffset}px)`, // Apply sliding effect
                    }}
                >
                    <div className="relative">
                        <SearchBar />
                    </div>
                </div>

                <div className="h-24"></div>

                {/* Right Sidebar Content */}
                <div
                    className={`fixed w-full lg:w-72 top-32 ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg shadow-md p-4 overflow-y-auto z-10 transition-transform duration-200`}
                    style={{
                        transform: `translateY(-${slideOffset}px)`,
                        height: `calc(100vh - ${128 - slideOffset}px)`,
                    }}
                >
                    <h2 className="font-semibold text-lg mb-4 dark:text-gray-200">
                        Top Rated Posts
                    </h2>
                    <RightBarPost posts={topFivePosts} /> {/* Pass posts as props */}
                </div>
            </div>
        </div>
    );
}

export default RightbarFb;
