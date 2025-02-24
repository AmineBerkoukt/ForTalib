import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchUser = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users"
                    className="w-full bg-gray-100 dark:bg-gray-700 py-2 pl-10 pr-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 text-sm"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
        </div>
    );
};

export default SearchUser;

