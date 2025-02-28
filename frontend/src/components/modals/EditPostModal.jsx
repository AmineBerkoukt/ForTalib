import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';
import { usePostStore } from "../../store/usePostStore.js";
import { Toaster } from "react-hot-toast";
import {useModalStore} from "../../store/useModalStore.js";

export default function EditPostModal({ isDarkMode, showModal, setShowModal, postId }) {
    const { getPostById, updatePost } = usePostStore();
    const modalRef = useRef(null);
    const {isModalActive , toggleModal} = useModalStore();
    console.log(isModalActive)

    useEffect(() => {

    }, [isModalActive]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        elevator: 'no',
        maximumCapacity: '1',
    });

    useEffect(() => {
        const fetchPost = async () => {
            if (showModal && postId) {
                const post = await getPostById(postId);
                if (post) {
                    setFormData({
                        title: post.title || '',
                        description: post.description || '',
                        price: post.price || '',
                        address: post.address || '',
                        elevator: post.elevator || 'no',
                        maximumCapacity: post.maximumCapacity || '1',
                    });
                }
            }
        };
        fetchPost();
    }, [showModal, postId, getPostById]);

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', handleEscapeKey);
        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [setShowModal]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePost(postId, formData);
            setShowModal(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowModal(false);
        }
    };

    const inputClasses = `w-full px-3 py-2 rounded-md border ${
        isDarkMode
            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`;

    const buttonClasses = `w-full px-4 py-2 text-white font-medium rounded-lg ${
        isDarkMode
            ? "bg-green-600 hover:bg-green-700"
            : "bg-green-500 hover:bg-green-600"
    } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;

    const modalContent = (
        <>
            {isModalActive && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        ref={modalRef}
                        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden`}
                    >
                        <button
                            onClick={toggleModal}
                            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>

                        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-2rem)] ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                            <h2 className="text-2xl font-bold mb-6">Edit Post</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={inputClasses}
                                            style={{ appearance: 'textfield' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Maximum Capacity (Rooms)</label>
                                        <select
                                            name="maximumCapacity"
                                            value={formData.maximumCapacity}
                                            onChange={handleInputChange}
                                            className={inputClasses}
                                        >
                                            {[1, 2, 3, 4, 5].map((room) => (
                                                <option key={room} value={room}>{room}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Elevator</label>
                                        <div className="flex space-x-4 mt-1">
                                            {['yes', 'no'].map((option) => (
                                                <label key={option} className={`inline-flex items-center ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                                    <input
                                                        type="radio"
                                                        name="elevator"
                                                        value={option}
                                                        checked={formData.elevator === option}
                                                        onChange={handleInputChange}
                                                        className={`form-radio h-5 w-5 ${
                                                            isDarkMode
                                                                ? "text-blue-600 border-gray-600"
                                                                : "text-blue-600 border-gray-300"
                                                        }`}
                                                    />
                                                    <span className="ml-2 capitalize">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className={inputClasses}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={buttonClasses}
                                >
                                    Update Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    return createPortal(modalContent, document.body);
}
