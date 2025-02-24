import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'

const LayoutContent = ({ children }) => {
    const { isDarkMode, toggleDarkMode } = useTheme()

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                <div className="flex">
                    <div className="hidden lg:block lg:w-64 lg:sticky lg:top-0 lg:h-screen">
                        <Sidebar/>
                    </div>
                    <main className="flex-grow p-4">{children}</main>

                </div>
            </div>
        </div>
    )
}

const Layout = ({children }) => {
    return (
        <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
    )
}

export default Layout

