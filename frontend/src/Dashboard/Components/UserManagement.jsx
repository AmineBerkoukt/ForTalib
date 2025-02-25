import React, { useState } from 'react';
import { Eye, UserPlus, Trash } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';


export default function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');

    const location = useLocation(); // Get current path
    const navigate = useNavigate(); // Navigate to other routes

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'All' || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    const handleDelete = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
            {/* Conditionally render header for /dashboard */}
            {location.pathname === '/dashboard' && (
                <div className="mb-4">
                    <h2
                        className="text-lg font-bold text-black dark:text-white cursor-pointer hover:underline"
                        onClick={() => navigate('/management')}
                    >
                        Users Management
                    </h2>
                </div>
            )}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded-md max-w-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                    <option value="All">All Roles</option>
                    <option value="House Owner">House Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Student">Student</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                                <button
                                    className="flex items-center px-2 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600">
                                    <Eye className="h-5 w-5 mr-1" />Profile
                                </button>
                                <button
                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                                    <UserPlus className="h-5 w-5 mr-1" />Make Admin
                                </button>
                                <button
                                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                    onClick={() => handleDelete(user.id)}>
                                    <Trash className="h-5 w-5 mr-1" />Delete
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
