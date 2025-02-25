import React from "react";
import { X, Save } from "lucide-react";
import ProfileDropdown from "./ProfileDropDown.jsx";

export default function ProfileActions({
                                           isOwnerConsultingProfile,
                                           isEditing,
                                           isDarkMode,
                                           isSubmitting,
                                           setIsEditing,
                                           handleSubmit,
                                           setIsDeleteModalOpen,
                                           handleLogout,
                                           toggleDarkMode,
                                       }) {
    if (!isOwnerConsultingProfile) return null;

    return (
        <div className="absolute top-4 right-4 flex items-center gap-3">
            {isEditing ? (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                        } transition-colors duration-200 flex items-center gap-2`}
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            ) : (
                <ProfileDropdown
                    isDarkMode={isDarkMode}
                    onEditClick={() => setIsEditing(true)}
                    onDeleteClick={() => setIsDeleteModalOpen(true)}
                    onLogoutClick={handleLogout}
                    toggleDarkMode={toggleDarkMode}
                />
            )}
        </div>
    );
}
