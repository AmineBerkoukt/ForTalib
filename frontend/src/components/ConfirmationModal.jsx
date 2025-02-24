import { createPortal } from "react-dom";
import { useTheme } from "../contexts/ThemeContext";


const ConfirmationModal = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message,
                               confirmText = "Confirm",
                               cancelText = "Cancel"
                           } ) => {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black/50 dark:bg-black/70"
                onClick={onClose}
            />
            <div className={`relative w-full max-w-sm mx-4 md:mx-auto p-6 rounded-lg shadow-xl transform transition-all ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
            }`}>
                <h3 className="text-xl font-semibold mb-4">
                    {title}
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {message}
                </p>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;