import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms and Conditions</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto text-gray-700 dark:text-gray-300 text-sm">
                    <p>
                        By creating an account, you agree to our Terms and Conditions. Please read them carefully before proceeding.
                    </p>
                    <ul>
                        <li className="mt-2"> <strong>
                            We are not responsible for any act of violence ...
                        </strong> </li>
                    </ul>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TermsAndConditionsModal;
