import React from 'react';
import { Users, Home, FileText } from 'lucide-react';

const stats = [
    { name: 'Total Users', stat: '10,234', icon: Users },
    { name: 'House Owners', stat: '45%', icon: Home },
    { name: 'Total Posts', stat: '1,234', icon: FileText },
];

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => {
                const Icon = item.icon; // Assign the icon to a variable
                return (
                    <div
                        key={item.name}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between"
                    >
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.name}
                            </p>
                            <Icon
                                className="h-6 w-6 text-gray-400 dark:text-gray-500"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {item.stat}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
