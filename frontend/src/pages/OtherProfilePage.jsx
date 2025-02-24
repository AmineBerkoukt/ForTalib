import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useProfileStore } from "../store/useProfileStore";
import { Loader2 } from "lucide-react";
import Layout from "../components/Layout";
import ProfileInfo from "../components/profile/ProfileInfo";
import Post from "../components/Post";
import PostDetailsModal from "../components/PostDetailsModal.jsx";

const OtherProfilePage = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const { profilePosts, user, getUserPosts, getUser } = useProfileStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    if (!id) return;

    setIsLoading(true);
    setError("");

    try {
      await Promise.all([getUser(id), getUserPosts(id)]);
    } catch (error) {
      setError("Failed to load profile data. Please try again later.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handlePostDeleted = async () => {
    await getUserPosts(id); // Directly refetch posts after deletion
  };


  if (isLoading) {
    return (
        <Layout isDarkMode={isDarkMode}>
          <div
              className={`min-h-screen ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-100"
              } flex items-center justify-center`}
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p
                  className={`text-lg ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Loading profile...
              </p>
            </div>
          </div>
        </Layout>
    );
  }

  if (error) {
    return (
        <Layout isDarkMode={isDarkMode}>
          <div
              className={`min-h-screen ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-100"
              } flex items-center justify-center`}
          >
            <div className="text-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
              <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
    );
  }

  return (
      <Layout isDarkMode={isDarkMode}>
          <PostDetailsModal />

          <div
            className={`min-h-screen ${
                isDarkMode ? "bg-gray-900" : "bg-gray-100"
            } py-8`}
        >
          <div className="container mx-auto px-4">
            <ProfileInfo
                user={user}
                isDarkMode={isDarkMode}
            />
              <div className="mt-12 max-w-4xl mx-auto">
                  <h2
                      className={`text-2xl font-bold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                      } mb-6`}
                  >
                      {user?.firstName} {user?.lastName}'s Posts
                  </h2>
                  <div className="space-y-6">
                      {profilePosts && profilePosts.length > 0 ? (
                          profilePosts.map((post) => {
                              // Preprocess the images array to ensure they start with the base URL
                              const processedImages = post.images?.map((image) => {
                                  // Check if the image already starts with the base URL
                                  if (image.startsWith('http://localhost:5000')) {
                                      return image; // Return as is if it already starts with the base URL
                                  }
                                  // Otherwise, prepend the base URL
                                  return `http://localhost:5000${image}`;
                              }) || []; // Fallback to an empty array if post.images is null or undefined

                              return (
                                  <Post
                                      key={post._id}
                                      postId={post._id}
                                      user={user}
                                      title={post.title}
                                      content={post.content}
                                      images={processedImages} // Pass the processed images array
                                      price={post.price}
                                      address={post.address}
                                      elevator={post.elevator}
                                      maximumCapacity={post.maximumCapacity}
                                      avgRate={post.avgRate}
                                      timestamp={post.createdAt}
                                      onDelete={handlePostDeleted} // Trigger refetch after deletion
                                  />
                              );
                          })
                      ) : (
                          <div
                              className={`text-center p-8 rounded-lg ${
                                  isDarkMode
                                      ? "bg-gray-800 text-gray-400"
                                      : "bg-white text-gray-600"
                              } shadow-sm`}
                          >
                              <p className="italic">No posts available.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </Layout>
  );
};

export default OtherProfilePage;
