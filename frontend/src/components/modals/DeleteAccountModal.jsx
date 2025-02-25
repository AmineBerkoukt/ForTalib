import React from "react";
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isDarkMode, isDeleting }) {
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