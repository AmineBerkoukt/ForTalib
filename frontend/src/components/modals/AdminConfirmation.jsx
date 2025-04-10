import React, {useEffect} from "react";
import {motion} from "framer-motion";
import {AlertTriangle, Ban, UserPlus, Info} from "lucide-react";

export default function AdminConfirmation({icon, selectedUser, actionType, onCancel, onConfirm}) {
    // Guard clause for when no user is selected
    if (!selectedUser) return null;

    // Add keyboard event listeners when the modal is open
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                onConfirm();
            } else if (event.key === "Escape") {
                onCancel();
            }
        };

        // Add the event listener
        window.addEventListener("keydown", handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onCancel, onConfirm]);

    // Determine modal content based on action type
    const getModalContent = () => {
        switch (actionType) {
            case "delete":
                return {
                    icon: icon || <AlertTriangle className="h-5 w-5 mr-2 text-red-600"/>,
                    title: "Delete User",
                    message: `Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`,
                    buttonClass: "bg-red-600 hover:bg-red-700"
                };
            case "ban":
                return {
                    icon: icon || <Ban className="h-5 w-5 mr-2 text-red-600"/>,
                    title: "Ban User",
                    message: `Are you sure you want to ban ${selectedUser.firstName} ${selectedUser.lastName}? This will prevent their access to the system.`,
                    buttonClass: "bg-red-600 hover:bg-red-700"
                };
            case "admin":
                return {
                    icon: icon || <UserPlus className="h-5 w-5 mr-2 text-blue-600"/>,
                    title: "Make Admin",
                    message: `Are you sure you want to make ${selectedUser.firstName} ${selectedUser.lastName} an admin? This will grant them full administrative privileges.`,
                    buttonClass: "bg-blue-600 hover:bg-blue-700"
                };
            case "unban":
                return {
                    icon: icon || <UserPlus className="h-5 w-5 mr-2 text-emerald-600"/>,
                    title: "Unban User",
                    message: `Are you sure you want to unban ${selectedUser.firstName} ${selectedUser.lastName}? This will restore their access to the system.`,
                    buttonClass: "bg-emerald-600 hover:bg-emerald-700"
                };
            default:
                return {
                    icon: icon || <Info className="h-5 w-5 mr-2 text-blue-600"/>,
                    title: "Confirm Action",
                    message: "Are you sure you want to perform this action?",
                    buttonClass: "bg-blue-600 hover:bg-blue-700"
                };
        }
    };

    const {icon: modalIcon, title, message, buttonClass} = getModalContent();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    {modalIcon} {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 ml-7">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-md text-white ${buttonClass} transition-colors`}
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    );
}