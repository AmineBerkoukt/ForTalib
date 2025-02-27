import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { BookmarkPlus, Search, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedPostStore } from "../store/useSavedPostStore.js";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const SavedPage = () => {
    const { isDarkMode } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    // Accessing Zustand store data and method
    const { savedPosts, loading, getSavedPosts } = useSavedPostStore();

    // Fetching saved posts when the component mounts
    useEffect(() => {
        getSavedPosts();
    }, []);

    const filteredAndSortedPosts = useMemo(() => {
        console.log("Saved posts:", savedPosts);

        if (!Array.isArray(savedPosts) || savedPosts.length === 0) {
            return [];
        }

        // Check the structure of the first post to determine how to access data
        const samplePost = savedPosts[0];
        console.log("Sample post structure:", samplePost);

        return savedPosts
            .filter(post => {
                // Safely access title and description using optional chaining
                const title = post.title || post.post?.title || '';
                const description = post.description || post.post?.description || '';

                return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    description.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.post?.createdAt);
                const dateB = new Date(b.createdAt || b.post?.createdAt);

                if (sortOrder === "asc") {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
    }, [savedPosts, searchTerm, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
    };

    return (
        <Layout isDarkMode={isDarkMode}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="text-left mb-8">
                    <h1
                        className={`text-3xl sm:text-4xl font-bold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                    >
                        Your <span className="text-blue-600">Saved Posts</span>
                    </h1>
                </header>

                {!loading && savedPosts.length > 0 && (
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search saved posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                                    isDarkMode
                                        ? "bg-gray-700 text-white placeholder-gray-400"
                                        : "bg-white text-gray-900 placeholder-gray-500"
                                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <button
                            onClick={toggleSortOrder}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                isDarkMode
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-white text-gray-900 hover:bg-gray-100"
                            } border border-gray-300 transition-colors duration-200`}
                        >
                            {sortOrder === "asc" ? (
                                <><SortAsc className="mr-2" /> Oldest First</>
                            ) : (
                                <><SortDesc className="mr-2" /> Newest First</>
                            )}
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        </div>
                    ) : savedPosts.length === 0 ? (
                        <div className={`text-center p-12 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                            <BookmarkPlus className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>No Posts Saved Yet</h2>
                            <p className={`text-xl mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Start bookmarking interesting posts to build your collection!
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                            >
                                Explore and Save Posts
                            </Link>
                        </div>
                    ) : filteredAndSortedPosts.length === 0 ? (
                        <div className={`text-center p-8 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
                            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                No posts match your search.
                            </p>
                        </div>
                    ) : (
                        filteredAndSortedPosts.map((savedPost) => {
                            // Get the actual post data, handling both potential structures
                            const postData = savedPost.post || savedPost;

                            const processedImages = (postData.images || []).map((image) => {
                                if (image.startsWith(BASE_URL)) {
                                    return image;
                                }
                                return `${BASE_URL}${image}`;
                            });

                            return (
                                <div
                                    key={postData._id}
                                    className={`transition-all duration-300 hover:scale-[1.01] ${
                                        isDarkMode ? "hover:shadow-lg hover:shadow-gray-700" : "hover:shadow-lg"
                                    }`}
                                >
                                    <Post
                                        key={postData._id}
                                        postId={postData._id}
                                        user={{
                                            _id: postData.user?.id,
                                            name: postData.user ? `${postData.user.firstName} ${postData.user.lastName}` : 'Unknown User',
                                            firstName: postData.user?.firstName,
                                            lastName: postData.user?.lastName,
                                            role: postData.user?.role,
                                            profilePhoto: postData.user?.profilePhoto,
                                        }}
                                        title={postData.title}
                                        content={postData.description}
                                        images={processedImages}
                                        timestamp={new Date(postData.createdAt).toLocaleString()}
                                        price={postData.price}
                                        address={postData.address}
                                        elevator={postData.elevator}
                                        maximumCapacity={postData.maximumCapacity}
                                        likesCount={postData.likesCount}
                                        avgRate={postData.avgRate}
                                        isSavedInitially={true}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SavedPage;