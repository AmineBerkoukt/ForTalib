import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout";
import ProfileInfo from "../components/profile/ProfileInfo";
import { usePostStore } from "../store/usePostStore.js";
import Post from "../components/Post";
import PostDetailsModal from "../components/PostDetailsModal.jsx";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { userPosts, getUserPosts } = usePostStore();
  const { isDarkMode } = useTheme();
  const [selectedImg, setSelectedImg] = useState(null);

  // Fetch user posts when `authUser` changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (authUser?._id) {
        await getUserPosts(authUser._id);
      }
    };
    fetchPosts();
  }, [authUser, getUserPosts]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file); // Key matches the backend's expected field name

    try {
      await updateProfile(formData); // Pass the FormData to your store function
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast.error("Failed to upload profile picture.");
    }
  };



  return (
      <Layout isDarkMode={isDarkMode}>
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} py-8`}>
          <div className="container mx-auto px-4">
            <PostDetailsModal />

            <ProfileInfo
                user={authUser}
                isDarkMode={isDarkMode}
                onImageUpload={handleImageUpload}
                isUpdating={isUpdatingProfile}
            />

            {/* User Posts Section */}
            <div className="mt-12 max-w-4xl mx-auto">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
                My Posts
              </h2>
              <div className="space-y-6">
                {userPosts && userPosts.length > 0 ? (
                    userPosts.map((post) => {
                      // Preprocess the images array to ensure they start with the base URL
                      const processedImages = post.images.map((image) => {
                        // Check if the image already starts with the base URL
                        if (image.startsWith('http://localhost:5000')) {
                          return image; // Return as is if it already starts with the base URL
                        }
                        // Otherwise, prepend the base URL
                        return `http://localhost:5000${image}`;
                      });

                      return (
                          <Post
                              key={post._id}
                              postId={post._id}
                              user={authUser}
                              title={post.title}
                              content={post.content}
                              images={processedImages} // Pass the processed images array
                              price={post.price}
                              address={post.address}
                              elevator={post.elevator}
                              maximumCapacity={post.maximumCapacity}
                              avgRate={post.avgRate}
                              timestamp={post.createdAt}
                          />
                      );
                    })
                ) : (
                    <div
                        className={`text-center p-8 rounded-lg ${
                            isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
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

export default ProfilePage;