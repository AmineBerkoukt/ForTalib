import React, { useState } from 'react';
import NavbarFB from './home/NavbarFB.jsx';
import SidebarFB from './home/SidebarFB.jsx';
import RightbarFb from './home/RightbarFB.jsx';
import NavbarFBMobile from './home/NavbarFBMobile.jsx';

const LayoutContent = ({ children, isChatPage, isDarkMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                {/* Desktop Navbar - Now Fixed */}
                <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
                    <NavbarFB isDarkMode={isDarkMode} />
                </div>

                {/* Mobile Navbar - Already Fixed */}
                <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
                    <NavbarFBMobile
                        isDarkMode={isDarkMode}
                        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="flex pt-[60px]">
                    {/* Sidebar */}
                    <div className={`
                        fixed lg:static lg:block lg:w-64 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)]
                        w-64 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        lg:translate-x-0
                    `}>
                        <SidebarFB isDarkMode={isDarkMode} />
                    </div>

                    {/* Main content */}
                    <main className="flex-grow w-full lg:ml-0 p-2 sm:p-4 overflow-auto">
                        {children}
                    </main>

                    {/* Right Sidebar */}
                    {!isChatPage && (
                        <div className="hidden lg:block lg:w-72 lg:h-auto lg:sticky lg:top-[60px] lg:mr-6">
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