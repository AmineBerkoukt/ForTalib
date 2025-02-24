import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        setIsDarkMode(savedTheme === 'dark')
    }, [])

    const toggleDarkMode = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        localStorage.setItem('theme', newMode ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

