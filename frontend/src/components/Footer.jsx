import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageSquare } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
    const { isDarkMode } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`w-full transition-colors duration-200`}>
            {/* Gray divider bar */}
            <div className={`w-full h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>

            {/* Footer content */}
            <div className={`w-full py-4 ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-center md:text-left">
                                © {currentYear} Khalliha 3ala Lah Team. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            <a href ="https://google.com" className="text-sm hover:text-primary transition-colors">
                                Support
                            </a>

                            <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;