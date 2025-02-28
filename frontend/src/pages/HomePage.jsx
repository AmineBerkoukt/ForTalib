import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";
import { useTheme } from "../contexts/ThemeContext";
import { useModalStore } from "../store/useModalStore";
import { usePostStore } from "../store/usePostStore";
import PostDetailsModal from "../components/modals/PostDetailsModal.jsx";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Newspaper, RefreshCcw } from 'lucide-react';
import ScrollToTop from "../components/ScrollToTop";
import { useSavedPostStore } from "../store/useSavedPostStore.js";

const POSTS_PER_PAGE = 10;

const HomePage = () => {
    const { isDarkMode } = useTheme();
    const { activateModal } = useModalStore();
    const { posts, getPosts } = usePostStore();
    const { getSavedPostsIds, savedPostsIds, loading } = useSavedPostStore();
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        getPosts();
        getSavedPostsIds();
    }, [getPosts, getSavedPostsIds]);

    useEffect(() => {
        if (posts) {
            const endIndex = currentPage * POSTS_PER_PAGE;
            setDisplayedPosts(posts.slice(0, endIndex));
        }
    }, [posts, currentPage]);

    const isLoading = posts === null;
    const hasMorePosts = posts?.length > displayedPosts.length;

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await getPosts();
        await getSavedPostsIds();
        setIsRefreshing(false);
        toast.success("Page refreshed successfully!");
    };

    return (
        <Layout isDarkMode={isDarkMode}>
            <ScrollToTop isDarkMode={isDarkMode} />

            <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8 p-4 rounded-xl ${
                        isDarkMode ? "bg-gradient-to-r from-blue-900/20 to-cyan-900/20" : "bg-gradient-to-r from-blue-50 to-purple-50"
                    }`}>
                        <div className="flex items-center gap-3">
                            <Newspaper className={`h-6 w-6 sm:h-7 sm:w-7 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}/>
                            <h1 className="text-xl sm:text-2xl font-bold">
                                Your Feed
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreatePost />
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                aria-label="Refresh feed"
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    isDarkMode
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                } shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
                                }`}
                            >
                                <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}/>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                            <p className="text-base sm:text-lg">
                                Loading posts...
                            </p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div
                            className={`text-center p-10 sm:p-14 rounded-xl shadow-md space-y-4 transition-all duration-200 ${
                                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                            }`}>
                            <Newspaper
                                className={`h-12 w-12 mx-auto ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}/>
                            <h2 className="text-xl sm:text-2xl font-semibold">
                                No posts available
                            </h2>
                            <p className="text-sm sm:text-base">
                                It seems a bit quiet here. Be the first to find your colocator !
                            </p>
                        </div>

                    ) : (
                        <div className="space-y-4 sm:space-y-6">
                            {displayedPosts.map((post) => {
                                const updatedImages = post.images
                                    ? post.images.map((image) => `http://localhost:5000${image}`)
                                    : [];

                                // Check if this post is in the savedPostsIds array
                                const isPostSaved = Array.isArray(savedPostsIds) && savedPostsIds.includes(post._id);

                                return (
                                    <div
                                        key={post._id}
                                        className={`transform transition-all duration-200 hover:scale-[1.01] ${
                                            isDarkMode ? "hover:shadow-lg hover:shadow-gray-800" : "hover:shadow-lg"
                                        }`}
                                    >
                                        <Post
                                            user={{
                                                _id: post.user?.id || 'unknown',
                                                name: post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User',
                                                firstName: post.user?.firstName || 'Unknown',
                                                lastName: post.user?.lastName || 'User',
                                                role: post.user?.role || 'user',
                                                profilePhoto: post.user?.profilePhoto
                                            }}
                                            postId={post._id}
                                            title={post.title}
                                            content={post.description}
                                            images={updatedImages}
                                            timestamp={new Date(post.createdAt).toLocaleString()}
                                            price={post.price}
                                            address={post.address}
                                            elevator={post.elevator}
                                            maximumCapacity={post.maximumCapacity}
                                            avgRate={post.avgRate}
                                            isSavedInitially={isPostSaved}
                                        />
                                    </div>
                                );
                            })}

                            {hasMorePosts && (
                                <div className="flex justify-center pt-4 pb-6 sm:pb-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className={`
                                            px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium shadow-sm transition-all duration-200
                                            ${isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }
                                            ${isLoadingMore ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                            ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
                                        `}
                                    >
                                        {isLoadingMore ? (
                                            <span className="flex items-center space-x-2">
                                                <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5"/>
                                                <span>Loading...</span>
                                            </span>
                                        ) : (
                                            'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;