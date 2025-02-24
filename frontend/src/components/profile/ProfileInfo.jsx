import { Mail, MapPin, Calendar, User, CheckCircle, Shield, Settings, Save, Camera, Trash2, AlertTriangle, Pencil, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from "react";
import { useProfileStore } from "../../store/useProfileStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import {useLocation, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_PFP_URL;

function DeleteAccountModal({ isOpen, onClose, onConfirm, isDarkMode, isDeleting }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transform transition-all`}>
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <AlertTriangle className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Delete Account</h2>
                </div>

                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors duration-200`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <Trash2 className="w-5 h-5" />
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProfileDropdown({ isDarkMode, onEditClick, onDeleteClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Profile menu"
            >
                <Settings className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-10 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEditClick();
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                            isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        } transition-colors duration-200`}
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDeleteClick();
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2 text-red-500 hover:text-red-600 ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        } transition-colors duration-200`}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ProfileInfo({ user, isDarkMode, onImageUpload, isUpdating }) {
    const location = useLocation();
    const isOwnerConsultingProfile = location.pathname === "/profile";
    const { updateProfile } = useProfileStore();
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
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setLocalUser(user);
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                address: user.address || '',
                phoneNumber: user.phoneNumber || '',
                cin: user.cin || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePhoto", file);

        try {
            await updateProfile(formData);
            toast.success("Profile picture updated successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Failed to upload profile picture:", error);
            toast.error("Failed to upload profile picture.");
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

    const fullName = `${displayUser?.firstName || ''} ${displayUser?.lastName || ''}`;


    let profileImageUrl = user?.profilePhoto
        //http://localhost:5000/${user.avatar}
        ? BASE_URL + user.profilePhoto
        : "/avatar.png";


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
                                        <Save/>
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <ProfileDropdown
                                    isDarkMode={isDarkMode}
                                    onEditClick={() => setIsEditing(true)}
                                    onDeleteClick={() => setIsDeleteModalOpen(true)}
                                />
                            )}
                        </div>
                    )}

                    {/* Rest of the component remains the same */}
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
                                        onChange={handleImageUpload}
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

function ProfileField({ icon, label, value, isEditing, children, isDarkMode, isSubmitting }) {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
        }`}>
            <div className="flex items-center gap-2 min-w-[140px]">
                {React.cloneElement(icon, {
                    className: `${icon.props.className} ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`
                })}
                <span className="font-medium text-xl">{label}:</span>
            </div>
            {isEditing && children ? (
                children
            ) : (
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xl transition-colors duration-300`}>
                    {value}
                </span>
            )}
        </div>
    );
}

function getInputClassName(isDarkMode) {
    return `px-4 py-2.5 rounded-lg w-full ${
        isDarkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:bg-gray-600'
            : 'bg-white text-gray-900 border-gray-300 focus:bg-gray-50'
    } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xl`;
}