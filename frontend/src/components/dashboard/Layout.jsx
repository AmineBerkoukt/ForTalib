import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'

const LayoutContent = ({ children }) => {
    const { isDarkMode, toggleDarkMode } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    useEffect(() => {
        setMounted(true)
        const darkModeClass = 'dark'
        const root = window.document.documentElement

        if (isDarkMode) {
            root.classList.add(darkModeClass)
        } else {
            root.classList.remove(darkModeClass)
        }
    }, [isDarkMode])

    if (!mounted) {
        return null
    }

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex-grow flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} toggleSidebar={toggleSidebar} />
                <div className="flex-grow flex">
                    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    <main className="flex-grow p-4 transition-colors duration-300 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

const Layout = ({children}) => {
    return (
        <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
    )
}

export default Layout

