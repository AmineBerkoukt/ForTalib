import React, { useState } from 'react';
import { Check, X } from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

const initialRequests = [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', status: 'Accepted' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', status: 'Rejected' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', status: 'Pending' },
];

export default function HouseOwnerRequests() {
    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const location = useLocation(); // Get current path
    const navigate = useNavigate(); // Navigate to other routes

    const filteredRequests = requests.filter(request => {
        const matchesSearch =
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === 'All' || request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
            {location.pathname === '/dashboard' && (
                <div className="mb-4">
                    <h2
                        className="text-lg font-bold text-black dark:text-white cursor-pointer hover:underline"
                        onClick={() => navigate('/requests')}
                    >
                       House Owner Requests
                    </h2>
                </div>
            )}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded-md max-w-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                    <option value="All">All</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.map((request) => (
                        <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {request.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {request.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {request.status}
                            </td>
                            <td className="px-6 py-8 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                                <button
                                    className="flex items-center px-3 py-2 text-sm font-medium text-white dark:text-gray-200 bg-blue-600 rounded-lg mr-2 hover:bg-blue-700 ">
                                    <Check className="h-5 w-5 mr-1" />
                                    Approve
                                </button>
                                <button
                                    className="flex items-center px-5 py-2 text-sm font-medium text-white dark:text-gray-200 bg-red-600 rounded-lg hover:bg-red-400">
                                    <X className="h-5 w-5 mr-1" />
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
