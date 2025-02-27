import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProfileStore } from '../store/useProfileStore.js';


const CompleteSignUp = () => {
    const { isDarkMode } = useTheme();
    const [previewImage, setPreviewImage] = useState(null);
    const [cin, setCin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock navigate function for demo
    const navigate = (path) => {
        console.log(`Navigating to: ${path}`);
        alert(`Navigation to ${path} would happen here`);
    };

    // Mock updateProfile function for demo
    const updateProfile = async (formData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Profile updated with:', {
                    cin: formData.get('cin'),
                    hasProfilePicture: formData.has('profilePicture')
                });
                resolve();
            }, 1500);
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            if (previewImage && e.target.profilePicture.files[0]) {
                formData.append('profilePicture', e.target.profilePicture.files[0]);
            }
            formData.append('cin', cin);

            await updateProfile(formData);
            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className={`w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg transition-all duration-200 overflow-hidden`}>
            <div className={`px-6 py-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Complete Your Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mx-auto transition-all duration-200 hover:shadow-lg`}>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <Camera size={40} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
                                    </div>
                                )}
                            </div>

                            <div className="absolute -bottom-2 right-0 flex space-x-2">
                                <label
                                    htmlFor="profilePicture"
                                    className={`p-2 rounded-full cursor-pointer
                                    ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} 
                                    shadow-lg transition-all duration-200 transform hover:scale-105`}
                                    title="Upload image"
                                >
                                    <Upload size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        name="profilePicture"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>

                                {previewImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className={`p-2 rounded-full
                                        ${isDarkMode ? 'bg-gray-700 hover:bg-red-700' : 'bg-white hover:bg-red-100'} 
                                        shadow-lg transition-all duration-200 transform hover:scale-105`}
                                        title="Remove image"
                                    >
                                        <X size={20} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Upload your profile picture
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cin" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            CIN (Optional):
                        </label>
                        <input
                            type="text"
                            id="cin"
                            name="cin"
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200
                            ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 placeholder-gray-400'}`}
                            placeholder="Enter your CIN"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-500 animate-pulse">{error}</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 flex-1
                            ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 flex-1
                            ${isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} 
                            transform hover:translate-y-[-1px] hover:shadow-md`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 size={20} className="animate-spin mr-2" />
                                    Processing...
                                </span>
                            ) : (
                                'Complete Registration'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignUp;