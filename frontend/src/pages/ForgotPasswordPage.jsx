import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, ArrowLeft, Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ForgotPasswordPage = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { forgotPassword } = useAuthStore();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [emailError, setEmailError] = useState('');

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages and errors
        setMessage({ type: '', text: '' });
        setEmailError('');

        // Validate email before submission
        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            await forgotPassword({ email });
            setMessage({
                type: 'success',
                text: 'Password reset link sent! Please check your email inbox.'
            });
            // Clear the form after successful submission
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to send reset instructions. Please try again later.'
            });
            console.error('Forgot password error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 flex-grow flex flex-col">
                {/* Header with back button and theme toggle */}
                <div className="flex justify-between items-center pt-6 sm:pt-8">
                    <Link
                        to="/login"
                        className={`p-2 rounded-lg transition-colors duration-200 flex items-center gap-2
                        ${isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Back to login page"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm sm:text-base">Back to Login</span>
                    </Link>

                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg transition-colors duration-200
                        ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm'
                        }`}
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-grow flex flex-col items-center justify-center py-8 sm:py-12">
                    <div className={`text-center mb-6 sm:mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Forgot Your Password?</h1>
                        <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
                            Don't worry! Enter your email and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    <div className="w-full max-w-md px-4">
                        <div className={`rounded-xl p-5 sm:p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className={`block text-sm font-medium mb-2 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`}
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (emailError) setEmailError('');
                                            }}
                                            disabled={isSubmitting}
                                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                                emailError
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                                        : 'bg-white border-gray-300 focus:border-blue-500'
                                            } ${
                                                isDarkMode
                                                    ? 'text-white placeholder-gray-400'
                                                    : 'text-gray-900 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 ${
                                                emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                            } transition-colors duration-200`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {emailError && (
                                        <div className="mt-1 flex items-center text-red-500 text-sm">
                                            <AlertCircle size={14} className="mr-1" />
                                            <span>{emailError}</span>
                                        </div>
                                    )}
                                </div>

                                {message.text && (
                                    <div
                                        className={`p-4 rounded-lg flex items-start ${
                                            message.type === 'success'
                                                ? isDarkMode
                                                    ? 'bg-green-800/60 text-green-200'
                                                    : 'bg-green-100 text-green-800'
                                                : isDarkMode
                                                    ? 'bg-red-800/60 text-red-200'
                                                    : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {message.type === 'success' ? (
                                            <CheckCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className="text-sm">{message.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 relative ${
                                        isSubmitting
                                            ? isDarkMode
                                                ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
                                                : 'bg-blue-400 text-white cursor-not-allowed'
                                            : isDarkMode
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <Loader size={18} className="animate-spin mr-2" />
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Reset Instructions'
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-center">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Remembered your password?{' '}
                                <Link
                                    to="/login"
                                    className={`font-medium ${
                                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;