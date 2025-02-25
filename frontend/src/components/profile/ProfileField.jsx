import React from "react";

export default function ProfileField({ icon, label, value, isEditing, children, isDarkMode, isSubmitting }) {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
        }`}>
            <div className="flex items-center gap-2 min-w-[140px]">
                {React.cloneElement(icon, {
                    className: `${icon.props.className} ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`
                })}
                <span className="font-medium text-xl">{label}:</span>
            </div>
            {isEditing && children ? (
                children
            ) : (
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xl transition-colors duration-300`}>
                    {value}
                </span>
            )}
        </div>
    );
}