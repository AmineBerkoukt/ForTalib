import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProfileStore } from '../store/useProfileStore.js';

const CompleteSignUp = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { updateProfile } = useProfileStore();
    const [previewImage, setPreviewImage] = useState(null);
    const [cin, setCin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);



        try {
            const formData = new FormData();
            if (previewImage) {
                formData.append('profilePicture', e.target.profilePicture.files[0]);
            }
            formData.append('cin', cin);

            await updateProfile(formData);
            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto p-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mx-auto`}>
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <Camera size={40} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="profilePicture"
                            className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} 
                shadow-lg transition-colors duration-200`}
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
                    </div>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
                        ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'}`}
                        placeholder="Enter your CIN"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
                    ${isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Completing Registration...' : 'Complete Registration'}
                </button>
            </form>
        </div>
    );
};

export default CompleteSignUp;
