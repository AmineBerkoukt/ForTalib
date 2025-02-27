import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../../contexts/ThemeContext.jsx"
import { AlertTriangle } from "lucide-react"

const ConfirmationModal = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message,
                               confirmText = "Confirm",
                               cancelText = "Cancel",
                           }) => {
    const { isDarkMode } = useTheme()

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscapeKey)
        return () => {
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                <div className={`absolute inset-0 ${isDarkMode ? "bg-gray-900" : "bg-gray-500"} opacity-75`}></div>
            </div>

            <div
                className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
            >
                <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className="sm:flex sm:items-start">
                        <div
                            className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                isDarkMode ? "bg-red-800" : "bg-red-100"
                            }`}
                        >
                            <AlertTriangle className={`h-6 w-6 ${isDarkMode ? "text-red-300" : "text-red-600"}`} aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3
                                className={`text-lg leading-6 font-medium ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
                                id="modal-headline"
                            >
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm
              ${
                            isDarkMode
                                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
              ${
                            isDarkMode
                                ? "border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-600"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default ConfirmationModal

