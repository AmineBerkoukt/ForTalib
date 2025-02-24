import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Play, MessageCircle } from 'lucide-react';
import { useModalStore } from '../store/useModalStore';
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore.js";
import ImageCarousel from './ImageCarousel'; // Import the ImageCarousel component

const PostDetailsModal = () => {
    const { isModalActive, modalData, disactivateModal } = useModalStore();
    const { isDarkMode } = useTheme();
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const { setSelectedUser } = useChatStore();
    const navigate = useNavigate();

    if (!isModalActive) return null;

    const handleTalkToOwner = async (userToTalkTo) => {
        setSelectedUser(userToTalkTo);
        navigate("/chat");
    }

    const mediaItems = [
        ...(modalData.images || []),
        ...(modalData.videos || [])
    ].map(item => `http://localhost:5000${item.trim()}`);

    console.log("modalData " +  modalData);


    return ReactDOM.createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? "bg-black/70" : "bg-black/50"} backdrop-blur-sm`}>
            <div className={`relative w-full max-w-5xl p-6 rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
                <button
                    onClick={disactivateModal}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                >
                    <X className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Carousel Section */}
                    <div className="space-y-4">
                        <ImageCarousel
                            images={mediaItems}
                            currentImageIndex={selectedMediaIndex}
                            onImageClick={setSelectedMediaIndex}
                        />

                        {/* Thumbnail Grid */}
                        {mediaItems.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {mediaItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedMediaIndex(index)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                                            selectedMediaIndex === index
                                                ? 'border-blue-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        {item.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <Play className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        ) : (
                                            <img
                                                src={item}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {console.log("modalData User : "+modalData.user)}
                    {console.log("modalData : " +modalData)}
                    {/* Post Details Section */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-2xl">{modalData.title}</h2>
                        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {modalData.description}
                        </p>

                        <div className={`space-y-2 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">Propriétaire:</span>
                                    <span>{`${modalData.user?.firstName} ${modalData.user?.lastName}`}</span>
                                </div>
                                <button
                                    onClick={() => handleTalkToOwner(modalData.user)}
                                    className="bg-blue-500 text-white py-1.5 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-1"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Contacter</span>
                                </button>
                            </div>

                            {[
                                { label: "Téléphone", value: modalData.user?.phoneNumber },
                                { label: "Adresse", value: modalData.address },
                                { label: "Prix", value: `${modalData.price} Dhs/mois` },
                                { label: "Évaluation", value: modalData.avgRate },
                                { label: "Ascenseur", value: modalData.elevator ? 'Disponible' : 'Non disponible' },
                                { label: "Capacité", value: `${modalData.maximumCapacity} personnes` },
                                { label: "Publié le", value: new Date(modalData.createdAt).toLocaleDateString() },
                            ].map((detail, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="font-medium">{detail.label}:</span>
                                    <span>{detail.value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PostDetailsModal;