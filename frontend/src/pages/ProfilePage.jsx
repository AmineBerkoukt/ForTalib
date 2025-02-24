import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { usePostStore } from "../store/usePostStore";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout";
import ProfileInfo from "../components/profile/ProfileInfo";
import Post from "../components/Post";
import PostDetailsModal from "../components/PostDetailsModal";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { id } = useParams();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { userPosts, getUserPosts } = usePostStore();
  const { profilePosts, user, getUser } = useProfileStore();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isOwnProfile = !id || id === authUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (isOwnProfile) {
          await getUserPosts(authUser._id);
        } else {
          await Promise.all([getUser(id), getUserPosts(id)]);
        }
      } catch (error) {
        setError("Failed to load profile data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, authUser, getUser, getUserPosts]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePhoto", file);
    try {
      await updateProfile(formData);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast.error("Failed to upload profile picture.");
    }
  };

  if (isLoading) {
    return (
        <Layout isDarkMode={isDarkMode}>
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-3">Loading profile...</p>
          </div>
        </Layout>
    );
  }

  if (error) {
    return (
        <Layout isDarkMode={isDarkMode}>
          <div className="min-h-screen flex items-center justify-center text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Retry</button>
          </div>
        </Layout>
    );
  }

  return (
      <Layout isDarkMode={isDarkMode}>
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <ProfileInfo
                user={isOwnProfile ? authUser : user}
                isDarkMode={isDarkMode}
                onImageUpload={isOwnProfile ? handleImageUpload : undefined}
                isUpdating={isUpdatingProfile}
            />
            <div className="mt-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                {isOwnProfile ? "My Posts" : `${user?.firstName} ${user?.lastName}'s Posts`}
              </h2>
              <div className="space-y-6">
                {(isOwnProfile ? userPosts : profilePosts)?.length > 0 ? (
                    (isOwnProfile ? userPosts : profilePosts).map((post) => (
                        <Post
                            key={post._id}
                            postId={post._id}
                            user={isOwnProfile ? authUser : user}
                            title={post.title}
                            content={post.content}
                            images={(post.images || []).map(img => img.startsWith("http") ? img : `http://localhost:5000${img}`)}
                            price={post.price}
                            address={post.address}
                            elevator={post.elevator}
                            maximumCapacity={post.maximumCapacity}
                            avgRate={post.avgRate}
                            timestamp={post.createdAt}
                        />
                    ))
                ) : (
                    <div className="text-center p-8 rounded-lg shadow-sm">
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
