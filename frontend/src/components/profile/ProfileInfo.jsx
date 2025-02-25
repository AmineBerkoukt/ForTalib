import React, { useState, useEffect } from "react";
import { Mail, MapPin, Calendar, User, CheckCircle, Shield, Save, Camera, X } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useProfileStore } from "../../store/useProfileStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import refactored components
import ProfileField from "./ProfileField.jsx";
import ProfileDropdown from "./ProfileDropDown.jsx";
import DeleteAccountModal from "../modals/DeleteAccountModal.jsx";
import { getInputClassName } from "./formUtils.jsx";

const BASE_URL = import.meta.env.VITE_PFP_URL;

export default function ProfileInfo({ user, isDarkMode, onImageUpload, isUpdating }) {
    const location = useLocation();
    const { authUser, logout } = useAuthStore();
    const { updateProfile } = useProfileStore();
    const { toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    // Check if the current user is the profile owner
    const isOwnerConsultingProfile = !location.pathname.includes('/profile/') ||
        (user && authUser && user._id === authUser._id);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        address: user?.address || '',
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
            address: user?.address || '',
            phoneNumber: user?.phoneNumber || '',
            cin: user?.cin || '',
        });
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    const fullName = `${displayUser?.firstName || ''} ${displayUser?.lastName || ''}`;

    let profileImageUrl = user?.profilePhoto ? `${BASE_URL}${user.profilePhoto}` : "/avatar.png";

    return (
        <>
            <div className={`relative max-w-4xl mx-auto rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } shadow-lg transition-all duration-300 ease-in-out`}>
                <div className="p-6">
                    {/* Header Actions */}
                    {isOwnerConsultingProfile && (
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                            {isEditing ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className={`px-4 py-2 rounded-lg font-medium ${
                                            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
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
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
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
                    )}

                    {/* Profile Picture Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-6 mb-4">
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
                                    <Camera className="w-5 h-5"/>
                                    <input
                                        type="file"
                                        name="profilePhoto"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={onImageUpload}
                                        disabled={isSubmitting}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Profile Info Header */}
                        <div className="text-center sm:text-left flex-grow mt-8">
                            <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                {fullName.trim() || 'Name not set'}
                                {displayUser?.role === "house_owner" && (
                                    <CheckCircle className="h-6 w-6 text-blue-500" />
                                )}
                                {displayUser?.role === "admin" && (
                                    <Shield className="h-6 w-6 text-purple-500" />
                                )}
                            </h1>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-3 mt-6">
                        <ProfileField
                            icon={<User className="w-6 h-6" />}
                            label="Name"
                            value={fullName.trim() || 'Name not set'}
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            isSubmitting={isSubmitting}
                        >
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={getInputClassName(isDarkMode)}
                                    placeholder="First Name"
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={getInputClassName(isDarkMode)}
                                    placeholder="Last Name"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </ProfileField>

                        <ProfileField
                            icon={<Mail className="w-6 h-6" />}
                            label="Email"
                            value={displayUser?.email || 'Email not set'}
                            isDarkMode={isDarkMode}
                        />

                        <ProfileField
                            icon={<MapPin className="w-6 h-6" />}
                            label="Address"
                            value={displayUser?.address || 'Address not set'}
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            isSubmitting={isSubmitting}
                        >
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={getInputClassName(isDarkMode)}
                                placeholder="Enter your address"
                                disabled={isSubmitting}
                            />
                        </ProfileField>

                        <ProfileField
                            icon={<Calendar className="w-6 h-6" />}
                            label="Phone"
                            value={displayUser?.phoneNumber || 'Phone not set'}
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            isSubmitting={isSubmitting}
                        >
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={getInputClassName(isDarkMode)}
                                placeholder="Enter your phone number"
                                disabled={isSubmitting}
                            />
                        </ProfileField>

                        <ProfileField
                            icon={<Calendar className="w-6 h-6" />}
                            label="CIN"
                            value={displayUser?.cin || 'CIN not set'}
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            isSubmitting={isSubmitting}
                        >
                            <input
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                className={getInputClassName(isDarkMode)}
                                placeholder="Enter your CIN"
                                disabled={isSubmitting}
                            />
                        </ProfileField>

                        <ProfileField
                            icon={<Calendar className="w-6 h-6" />}
                            label="Joined"
                            value={displayUser?.createdAt?.split("T")[0] || 'Join date not set'}
                            isDarkMode={isDarkMode}
                        />
                    </div>
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