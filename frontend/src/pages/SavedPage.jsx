import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import api from "../utils/api.js";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { BookmarkPlus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            } catch (err) {
                console.error("Failed to fetch saved posts:", err);
                setSavedPosts([]);
            } finally {
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
                return sortOrder === "asc"
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [savedPosts, searchTerm, sortOrder]);

    return (
        <Layout isDarkMode={isDarkMode}>
            <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="text-left mb-8">
                    <h1 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Your <span className="text-blue-600">Saved Posts</span>
                    </h1>
                </header>

                <div className="flex-grow flex flex-col justify-center items-center space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        </div>
                    ) : savedPosts.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center h-full text-center p-12 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                            <BookmarkPlus className={`w-20 h-20 mb-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>No Posts Saved Yet</h2>
                            <p className={`text-xl mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Start bookmarking interesting posts to build your collection!
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                            <Post
                                key={savedPost._id}
                                postId={savedPost._id}
                                user={{
                                    _id: savedPost.user?.id,
                                    name: savedPost.user ? `${savedPost.user.firstName} ${savedPost.user.lastName}` : 'Unknown User',
                                    firstName: savedPost.user?.firstName,
                                    lastName: savedPost.user?.lastName,
                                    role: savedPost.user?.role,
                                    profilePhoto: savedPost.user?.profilePhoto,
                                }}
                                title={savedPost.title}
                                content={savedPost.description}
                                images={(savedPost.images || []).map(image => image.startsWith(BASE_URL) ? image : `${BASE_URL}${image}`)}
                                timestamp={new Date(savedPost.createdAt).toLocaleString()}
                                price={savedPost.price}
                                address={savedPost.address}
                                elevator={savedPost.elevator}
                                maximumCapacity={savedPost.maximumCapacity}
                                likesCount={savedPost.likesCount}
                                avgRate={savedPost.avgRate}
                            />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SavedPage;
