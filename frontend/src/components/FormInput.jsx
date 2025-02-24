import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ label, icon: Icon, inputRef, placeholder, type = "text", showPassword, setShowPassword }) => {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder={placeholder}
                    ref={inputRef}
                />
                {type === "password" && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormInput;

