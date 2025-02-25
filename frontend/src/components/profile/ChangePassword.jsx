"use client";

import {useState, useRef} from "react";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import {Eye, EyeOff} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useProfileStore} from "../../store/useProfileStore.js";
import toast from "react-hot-toast";

export default function ChangePassword() {
    const {isDarkMode} = useTheme();
    const navigate = useNavigate();

    const existingPasswordRef = useRef("");
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");

    const [showExistingPassword, setShowExistingPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const changePassword = useProfileStore((state) => state.changePassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existingPassword = existingPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        // Validate that the new password and confirmation match
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirmation do not match!");
            return;
        }

        try {
            await changePassword({
                existingPassword,
                newPassword
            });
            toast.success("Password changed successfully!");
        } catch (e) {
            toast.error("Password was NOT changed!");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const inputClass = `w-full px-3 py-2 rounded-md ${
        isDarkMode
            ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`;

    const buttonClass = `w-full py-2 px-4 rounded-md font-semibold text-white transition duration-200`;

    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <div
                className={`w-full max-w-md space-y-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-md`}>
                <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Change Your Password</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="existing-password" className="sr-only">
                                Existing Password
                            </label>
                            <input
                                id="existing-password"
                                name="existing-password"
                                type={showExistingPassword ? "text" : "password"}
                                required
                                className={inputClass}
                                placeholder="Existing Password"
                                ref={existingPasswordRef}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowExistingPassword(!showExistingPassword)}
                            >
                                {showExistingPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400"/>
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400"/>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="new-password" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                name="new-password"
                                type={showNewPassword ? "text" : "password"}
                                required
                                className={inputClass}
                                placeholder="New Password"
                                ref={newPasswordRef}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400"/>
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400"/>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className={inputClass}
                                placeholder="Confirm New Password"
                                ref={confirmPasswordRef}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400"/>
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400"/>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`${buttonClass} bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex-1`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${buttonClass} bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex-1`}
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
