import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import api from "../utils/api.js";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { BookmarkPlus, Search, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import { Link } from 'react-router-dom';
import PostDetailsModal from "../components/modals/PostDetailsModal.jsx";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const SavedPage = () => {
    const { isDarkMode } = useTheme();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await api.get("/saved");
                setSavedPosts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch saved posts:", err);
                setSavedPosts([]);
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const filteredAndSortedPosts = useMemo(() => {
        return savedPosts
            .filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOrder === "asc") {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                } else {
                    return new Date(b.createdAt) - new Date(a.createdAt);
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
                        filteredAndSortedPosts.map((savedPost) => (
                            <div
                                key={savedPost._id}
                                className={`transition-all duration-300 hover:scale-[1.01] ${
                                    isDarkMode ? "hover:shadow-lg hover:shadow-gray-700" : "hover:shadow-lg"
                                }`}
                            >
                                {/* Preprocess the images array to ensure they start with the base URL */}
                                {(() => {
                                    const processedImages = (savedPost.images || []).map((image) => {
                                        // Check if the image already starts with the base URL
                                        if (image.startsWith('http://localhost:5000')) {
                                            return image; // Return as is if it already starts with the base URL
                                        }
                                        // Otherwise, prepend the base URL
                                        return `http://localhost:5000${image}`;
                                    });

                                    return (

                                        <Post
                                            key={savedPost._id}
                                            postId={savedPost._id}
                                            user={{
                                                _id: savedPost.user?.id,
                                                name: savedPost.user ? `${savedPost.user.firstName} ${savedPost.user.lastName}` : 'Unknown User',
                                                firstName: savedPost.user?.firstName,
                                                lastName: savedPost.user?.lastName ,
                                                role: savedPost.user?.role,
                                                profilePhoto: savedPost.user?.profilePhoto,
                                            }}
                                            title={savedPost.title}
                                            content={savedPost.description}
                                            images={processedImages} // Pass the processed images array
                                            timestamp={new Date(savedPost.createdAt).toLocaleString()}
                                            price={savedPost.price}
                                            address={savedPost.address}
                                            elevator={savedPost.elevator}
                                            maximumCapacity={savedPost.maximumCapacity}
                                            likesCount={savedPost.likesCount}
                                            avgRate={savedPost.avgRate}
                                        />
                                    );
                                })()}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SavedPage;

