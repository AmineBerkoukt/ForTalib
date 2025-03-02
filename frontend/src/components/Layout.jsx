import React, { useState } from 'react';
import NavbarFB from './home/NavbarFB.jsx';
import SidebarFB from './home/SidebarFB.jsx';
import RightbarFb from './home/RightbarFB.jsx';
import NavbarFBMobile from './home/NavbarFBMobile.jsx';

const LayoutContent = ({ children, isChatPage, isDarkMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                {/* Desktop Navbar */}
                <div className="hidden lg:block sticky top-0 z-30">
                    <NavbarFB isDarkMode={isDarkMode} />
                </div>

                {/* Mobile Navbar - Fixed at top */}
                <div className="lg:hidden fixed top-0 w-full z-30">
                    <NavbarFBMobile
                        isDarkMode={isDarkMode}
                        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={handleOverlayClick}
                    />
                )}

                <div className="flex pt-16 lg:pt-0">
                    {/* Sidebar - Fixed on mobile, static on desktop */}
                    <aside 
                        className={`
                            fixed lg:sticky top-0 lg:top-0 h-screen overflow-y-auto
                            w-64 bg-white dark:bg-gray-800 z-50 
                            transform transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                            lg:translate-x-0
                            lg:flex-shrink-0
                        `}
                    >
                        <SidebarFB isDarkMode={isDarkMode} />
                    </aside>

                    {/* Main content - Responsive width */}
                    <main className="flex-grow w-full lg:ml-0 p-2 sm:p-4">
                        {children}
                    </main>

                    {/* Right Sidebar - Hidden on mobile and chat pages */}
                    {!isChatPage && (
                        <aside className="hidden lg:block w-64 sticky top-0 h-screen overflow-y-auto">
                            <RightbarFb isDarkMode={isDarkMode} />
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children, isChatPage = false, isDarkMode = false }) => {
    return (
        <LayoutContent isChatPage={isChatPage} isDarkMode={isDarkMode}>
            {children}
        </LayoutContent>
    );
};

export default Layout;