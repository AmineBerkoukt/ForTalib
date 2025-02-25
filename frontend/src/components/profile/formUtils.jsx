
export function getInputClassName(isDarkMode) {
    return `px-4 py-2.5 rounded-lg w-full ${
        isDarkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:bg-gray-600'
            : 'bg-white text-gray-900 border-gray-300 focus:bg-gray-50'
    } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xl`;
}