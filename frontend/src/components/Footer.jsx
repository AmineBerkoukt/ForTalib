import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, X } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
    const { isDarkMode } = useTheme();
    const currentYear = new Date().getFullYear();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <footer className={`w-full py-4 transition-colors duration-200 border-t ${isDarkMode ? "bg-gray-900 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                            <span> © {currentYear} All rights reserved to Khalliha 3ala Lah Team</span>
                        </div>
                        <div className="flex space-x-4">
                            <a 
                                href="#" 
                                onClick={openModal}
                                className="hover:text-primary transition-colors"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`relative rounded-lg shadow-lg p-6 max-w-md w-full ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
                        {/* Close button */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className={isDarkMode ? "text-gray-300" : "text-gray-600"} size={20} />
                                <a href="mailto:amine.docs0@gmail.com" className="hover:underline">
                                    amine.docs0@gmail.com
                                </a>
                            </div>
                            
                            {/* <div className="flex items-center space-x-3">
                                <Phone className={isDarkMode ? "text-gray-300" : "text-gray-600"} size={20} />
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    WhatsApp Support (+123 456 7890)
                                </a>
                            </div> */}
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button 
                                onClick={closeModal}
                                className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;