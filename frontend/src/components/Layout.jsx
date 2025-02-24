import React, { useState } from 'react';
import NavbarFB from './NavbarFB.jsx';
import SidebarFB from './SidebarFB.jsx';
import RightbarFb from './RightbarFB.jsx';
import MobileNav from './MobileNav.jsx';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const LayoutContent = ({ children, isChatPage, isDarkMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                {/* Desktop Navbar */}
                <div className="hidden lg:block">
                    <NavbarFB isDarkMode={isDarkMode} />
                </div>

                {/* Mobile Navbar */}
                <MobileNav
                    isDarkMode={isDarkMode}
                    onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="flex pt-[60px] lg:pt-0">
                    {/* Sidebar */}
                    <div className={`
                        fixed lg:static lg:block lg:w-64 lg:sticky lg:top-0 lg:h-screen
                        w-64 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        lg:translate-x-0
                    `}>
                        <SidebarFB isDarkMode={isDarkMode} />
                    </div>

                    {/* Main content */}
                    <main className="flex-grow p-4">{children}</main>

                    {/* Right Sidebar */}
                    {!isChatPage && (
                        <div className="hidden lg:block lg:w-64 lg:h-auto lg:sticky lg:top-0 lg:mr-4">
                            <RightbarFb isDarkMode={isDarkMode} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children, isChatPage, isDarkMode }) => {
    return (
        <LayoutContent isChatPage={isChatPage} isDarkMode={isDarkMode}>
            {children}
        </LayoutContent>
    );
};

export default Layout;