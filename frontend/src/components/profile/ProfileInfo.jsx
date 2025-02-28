import React, { useState, useEffect } from "react";
import { Mail,  Calendar, User, CheckCircle, Shield, Save, Camera, X } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useProfileStore } from "../../store/useProfileStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileField from "./ProfileField.jsx";
import DeleteAccountModal from "../modals/DeleteAccountModal.jsx";
import { getInputClassName } from "./formUtils.jsx";
import ProfileActions from "./ProfileActions.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileDetails from "./ProfileDetails.jsx";

const BASE_URL = import.meta.env.VITE_PFP_URL;

export default function ProfileInfo({ user, isDarkMode, isUpdating }) {
    const location = useLocation();
    const { authUser } = useAuthStore();
    const { updateProfile } = useProfileStore();
    const { toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    // Check if the current user is the profile owner
    const isOwnerConsultingProfile = !location.pathname.includes('/profile/') ||
        (user && authUser && user._id === authUser._id);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
        cin: user?.cin || '',
    });
    const [localUser, setLocalUser] = useState(user);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setLocalUser(user);
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
            cin: user?.cin || '',
        });
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check if the field is 'lastName' and convert to uppercase
        if (name === 'lastName') {
            setFormData(prev => ({
                ...prev,
                [name]: value.toUpperCase(),  // Ensure lastName is uppercase
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value);
                }
            });

            const response = await updateProfile(formDataToSend);

            if (response?.user) {
                setLocalUser(prev => ({
                    ...prev,
                    ...response.user.user
                }));
                setFormData(prev => ({
                    ...prev,
                    ...response.user.user
                }));
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            //To implement in the store !
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            toast.success('Account deleted successfully');
            navigate("/signup");

        } catch (error) {
            toast.error('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const displayUser = isEditing ? {
        ...localUser,
        ...formData
    } : localUser;

    const fullName = `${displayUser?.firstName || ''} ${displayUser?.lastName.toUpperCase() || ''}`;

    let profileImageUrl = user?.profilePhoto ? `${BASE_URL}${user.profilePhoto}` : "/avatar.png";

    return (
        <>
            <div className={`relative max-w-4xl mx-auto rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } shadow-lg transition-all duration-300 ease-in-out`}>
                <div className="p-6">
                    {/* Header Actions */}
                    <ProfileActions
                        isOwnerConsultingProfile={isOwnerConsultingProfile}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        isDarkMode={isDarkMode}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        toggleDarkMode={toggleDarkMode}
                    />

                    {/* Profile Picture Section */}
                    <ProfileHeader
                        profileImageUrl={profileImageUrl}
                        isOwnerConsultingProfile={isOwnerConsultingProfile}
                        isDarkMode={isDarkMode}
                        isUpdating={isUpdating}
                        isSubmitting={isSubmitting}
                        fullName={fullName}
                        displayUser={displayUser}
                    />

                    <ProfileDetails
                        displayUser={displayUser}
                        formData={formData}
                        handleChange={handleChange}
                        isEditing={isEditing}
                        isDarkMode={isDarkMode}
                        isSubmitting={isSubmitting}
                        fullName={fullName}
                    />

                </div>
            </div>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                isDarkMode={isDarkMode}
                isDeleting={isDeleting}
            />
        </>
    );
}