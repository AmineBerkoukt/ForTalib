import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {useAuthStore} from '../store/useAuthStore';

const ResetPasswordPage = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { token } = useParams();

    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { resetPassword } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Invalid or expired reset token');
            return;
        }

        const newPassword = newPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Basic password validation
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const res = await resetPassword(token, newPassword);
            if(res.status === 200 || res.status === 201) {
                navigate('/login', {
                    replace: true,
                    state: { message: 'Password reset successful. Please log in with your new password.' }
                });
            }

        } catch (error) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = `w-full px-3 py-2 rounded-lg ${
        isDarkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
            : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
            <div className="container mx-auto px-4">
                <div className="pt-4">
                    <Link
                        to="/login"
                        className={`inline-flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                            isDarkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Login</span>
                    </Link>
                </div>

                <div className="py-12">
                    <div className={`text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Please enter your new password below
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className={`rounded-xl p-6 md:p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label
                                            htmlFor="new-password"
                                            className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            New Password
                                        </label>
                                        <input
                                            id="new-password"
                                            ref={newPasswordRef}
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            className={inputClass}
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-[38px] text-gray-400"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <label
                                            htmlFor="confirm-password"
                                            className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            Confirm New Password
                                        </label>
                                        <input
                                            id="confirm-password"
                                            ref={confirmPasswordRef}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            className={inputClass}
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-[38px] text-gray-400"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className={`p-4 rounded-lg ${
                                        isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                                        isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;