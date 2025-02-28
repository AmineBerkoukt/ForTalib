import React from "react";
import { CheckCircle, Shield, Camera } from "lucide-react";
import toast from "react-hot-toast";
import {useAuthStore} from "../../store/useAuthStore.js";

export default function ProfileHeader({
                                          profileImageUrl,
                                          isOwnerConsultingProfile,
                                          isDarkMode,
                                          isUpdating,
                                          isSubmitting,
                                          fullName,
                                          displayUser
                                      }) {
    const { updateProfile } = useAuthStore()

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append("profilePhoto", file)
        try {
            await updateProfile(formData)
            toast.success("Profile picture updated successfully!")
            window.location.reload()
        } catch (error) {
            console.error("Failed to upload profile picture:", error)
            toast.error("Failed to upload profile picture.")
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-6 mb-4">
            {/* Profile Picture Section */}
            <div className="relative group">
                <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                {isOwnerConsultingProfile && (
                    <label
                        className={`absolute bottom-2 right-2 p-2 rounded-full cursor-pointer
                        ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
                        shadow-lg transition-all duration-200 ${isUpdating ? 'animate-pulse' : ''}`}
                    >
                        <Camera className="w-5 h-5" />
                        <input
                            type="file"
                            name="profilePhoto"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isSubmitting}
                        />
                    </label>
                )}
            </div>

            {/* Profile Info Header */}
            <div className="text-center sm:text-left flex-grow mt-8">
                <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center sm:justify-start gap-2">
                    {fullName.trim() || "Name not set"}
                    {displayUser?.role === "house_owner" && (
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                    {displayUser?.role === "admin" && (
                        <Shield className="h-6 w-6 text-purple-500" />
                    )}
                </h1>
            </div>
        </div>
    );
}
