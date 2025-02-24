import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore.js";
import { Eye, UserPlus, Trash, Search, Filter, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement({ isDashboard = false }) {
    const users = useUserStore(state => state.users);
    const loading = useUserStore(state => state.loading);
    const error = useUserStore(state => state.error);
    const fetchUsers = useUserStore(state => state.fetchUsers);
    const makeAdmin = useUserStore(state => state.makeAdmin);
    const deleteUser = useUserStore((state) => state.deleteUser);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await deleteUser(userId);
        }
    };

    const roleDisplayNames = {
        admin: "Admin",
        student: "Student",
        house_owner: "House Owner",
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleMakeAdmin = async (userId) => {
        await makeAdmin(userId);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const displayedUsers = isDashboard ? filteredUsers.slice(0, 5) : filteredUsers;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error}
            </div>
        );
    }

    const handleNavigateToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Users Management
                </h2>
                {isDashboard && (
                    <button
                        onClick={() => navigate("/management")}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                )}
            </div>

            {!isDashboard && (
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full sm:w-64 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select
                            className="pl-10 pr-3 py-2 w-full sm:w-40 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                            <option value="house_owner">House Owner</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6 w-1/4">Name</th>
                                {!isDashboard && (
                                    <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 w-1/4">Email</th>
                                )}
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 w-1/4">Role</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-1/4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {displayedUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-gray-900"
                                    >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        {!isDashboard && (
                                            <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                        )}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' :
                                                    user.role === 'student' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                            }`}>
                                                {roleDisplayNames[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleNavigateToProfile(user._id)}
                                                    className="flex items-center px-2 py-1 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    <Eye className="h-4 w-4 mr-1"/> <span className="hidden sm:inline">Profile</span>
                                                </button>
                                                {!isDashboard && (
                                                    <>
                                                        {user.role !== "admin" ? (
                                                            <button
                                                                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                                                onClick={() => handleMakeAdmin(user._id)}
                                                            >
                                                                <UserPlus className="h-4 w-4 mr-1"/> <span className="hidden sm:inline">Make Admin</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="px-2 py-1 bg-green-500 text-white rounded-md flex items-center opacity-50 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                <span className="hidden sm:inline">Already Admin</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                                                        >
                                                            <Trash className="h-4 w-4 mr-1"/> <span className="hidden sm:inline">Delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

