// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
    const { isDarkMode } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`w-full py-4 transition-colors duration-200 border-t ${isDarkMode ? "bg-gray-900 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                        <span> © {currentYear} All rights reserved to Khalliha 3ala Lah Team</span>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://google.com" className="hover:text-primary transition-colors">
                            Support
                        </a>
                        <Link to="/terms" className="hover:text-primary transition-colors">
                            Terms
                        </Link>
                        <Link to="/privacy" className="hover:text-primary transition-colors">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;