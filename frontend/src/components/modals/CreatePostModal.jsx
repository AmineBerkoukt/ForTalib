import { useState, useRef, useEffect } from "react"
import { X, Upload, Loader } from "lucide-react"
import { usePostStore } from "../../store/usePostStore.js"
import LoadingOverlay from "../skeletons/LoadingOverlay.jsx"
import { toast } from "react-hot-toast";
import {
    postValidator
} from "../../utils/validators_filters";

export default function CreatePostModal({ isDarkMode, showModal, setShowModal }) {
    const { createPost, isLoading } = usePostStore();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        elevator: "no",
        maximumCapacity: "1",
        images: [],
    })

    const modalRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") setShowModal(false)
        }
        window.addEventListener("keydown", handleEscapeKey)
        return () => window.removeEventListener("keydown", handleEscapeKey)
    }, [setShowModal])

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [showModal])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 6) {
            toast.error("You can upload up to 6 images only.")
            return
        }
        setFormData((prev) => ({
            ...prev,
            images: files,
        }))
    }

    const removeImage = (index) => {
        const newImages = Array.from(formData.images)
        newImages.splice(index, 1)
        setFormData((prev) => ({
            ...prev,
            images: newImages,
        }))
        if (newImages.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use the postValidator function to validate form data
        const validationResult = postValidator(formData);

        if (!validationResult) {
            // Format and display validation errors
            const newErrors = {};
            setErrors(newErrors);
            return;
        }

        try {
            await createPost(formData);
            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                price: "",
                address: "",
                elevator: "no",
                maximumCapacity: "1",
                images: [],
            });
            setErrors({}); // Clear errors on successful submission
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post. Please try again.");
        }
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowModal(false)
        }
    }

    return (
        <>
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        ref={modalRef}
                        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden`}
                    >
                        {isLoading && <LoadingOverlay isDarkMode={isDarkMode} />}
                        <button
                            onClick={() => setShowModal(false)}
                            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>

                        <div
                            className={`p-6 overflow-y-auto max-h-[calc(90vh-2rem)] ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
                        >
                            <h2 className="text-2xl font-bold mb-6">Create Post</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="title">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 rounded-md border ${
                                                isDarkMode
                                                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                                                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                            } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                            required
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="price">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 rounded-md border ${
                                                isDarkMode
                                                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                                                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                            } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                            style={{appearance: "textfield"}}
                                            required
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="maximumCapacity">
                                            Maximum Capacity (Rooms)
                                        </label>
                                        <select
                                            id="maximumCapacity"
                                            name="maximumCapacity"
                                            value={formData.maximumCapacity}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 rounded-md border ${
                                                isDarkMode
                                                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                                                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                            } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                        >
                                            {[1, 2, 3, 4, 5].map((room) => (
                                                <option key={room} value={room}>
                                                    {room}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.maximumCapacity && <p className="text-red-500 text-sm mt-1">{errors.maximumCapacity}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Elevator</label>
                                        <div className="flex space-x-4 mt-1">
                                            {["yes", "no"].map((option) => (
                                                <label key={option} className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="elevator"
                                                        value={option}
                                                        checked={formData.elevator === option}
                                                        onChange={handleInputChange}
                                                        className="form-radio h-5 w-5 text-blue-600"
                                                    />
                                                    <span className="ml-2 capitalize">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.elevator && <p className="text-red-500 text-sm mt-1">{errors.elevator}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="address">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 rounded-md border ${
                                            isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                                                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                        } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className={`w-full px-3 py-2 rounded-md border ${
                                            isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                                                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                        } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                        required
                                    ></textarea>
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Upload Images (Max: 6)</label>
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                                isDarkMode
                                                    ? "text-white bg-blue-600 hover:bg-blue-700"
                                                    : "text-white bg-blue-500 hover:bg-blue-600"
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                                        >
                                            <Upload className="w-5 h-5 mr-2" />
                                            Choose Images
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            aria-label="Upload images"
                                        />
                                    </div>
                                    <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-center`}>
                                        PNG, JPG, GIF up to 10MB each
                                    </p>
                                    {errors.images && <p className="text-red-500 text-sm mt-1 text-center">{errors.images}</p>}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative w-20 h-20">
                                            <img
                                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                                alt={`preview-${index}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                                aria-label="Remove image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                                        isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                                    } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="inline-block animate-spin mr-2" size={16} />
                                            Creating Post...
                                        </>
                                    ) : (
                                        "Create Post"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}