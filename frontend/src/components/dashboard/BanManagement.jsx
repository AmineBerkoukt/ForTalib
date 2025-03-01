import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore.js";
import { CheckSquare, Search, Filter, ChevronRight, Ban, X, AlertTriangle, Shield } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

export default function BanManagement({ isDashboard = false }) {
    const users = useUserStore(state => state.users);
    const loading = useUserStore(state => state.loading);
    const error = useUserStore(state => state.error);
    const fetchUsers = useUserStore(state => state.fetchUsers);
    const deleteUser = useUserStore(state => state.deleteUser);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUserAction = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        if (actionType === "delete") {
            await deleteUser(selectedUser._id);
        } else if (actionType === "unban") {
            // Implement unban functionality
            console.log("Unbanning user:", selectedUser._id);
        } else if (actionType === "ban") {
            // Implement ban functionality
            console.log("Banning user:", selectedUser._id);
        }
        setShowConfirmModal(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const clearFilter = () => {
        setRoleFilter("");
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = `${user.firstName} ${user.lastName} ${user.email} ${user.cin} ${user.phoneNumber}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const displayedUsers = isDashboard ? filteredUsers.slice(0, 5) : filteredUsers;

    // Determine badge color based on user role
    const getBadgeStyles = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
            case 'student':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'teacher':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    // Get icon for user role
    const getRoleIcon = (role) => {
        switch(role) {
            case 'admin':
                return <Shield className="h-3 w-3 mr-1" />;
            case 'student':
                return null;
            case 'teacher':
                return null;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-36 w-full">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm dark:bg-red-900/20 dark:border-red-800">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    <p className="text-red-700 dark:text-red-400 font-medium">Error: {error}</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Ban className="mr-2 h-5 w-5 text-red-600" />
                    User <span className="text-red-600 ml-1">Ban Management</span>
                </h2>
                {isDashboard && (
                    <button
                        onClick={() => navigate("/management")}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm font-medium"
                    >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            {!isDashboard && (
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, CIN or phone..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto -mx-4 sm:-mx-4 rounded-lg">
                <div className="inline-block min-w-full py-1 align-middle sm:px-4">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200 sm:pl-4">
                                    Name
                                </th>
                                {!isDashboard && (
                                    <>
                                        <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200">
                                            Email
                                        </th>
                                        <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200">
                                            CIN
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200">
                                            Phone
                                        </th>
                                        <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200">
                                            Role
                                        </th>

                                    </>
                                )}

                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {displayedUsers.length > 0 ? (
                                    displayedUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-4">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            {!isDashboard && (
                                                <>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                                                        {user.email}
                                                    </td>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                                                        {user.cin || "—"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                                                        {user.phoneNumber || "—"}
                                                    </td>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                                                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getBadgeStyles(user.role)}`}>
                                                            {getRoleIcon(user.role)}
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {!isDashboard && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUserAction(user, "unban")}
                                                                className="px-2 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 flex items-center text-xs"
                                                                title="Unban User"
                                                            >
                                                                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                                                                <span className="hidden sm:inline">Unban</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleUserAction(user, "ban")}
                                                                className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center text-xs"
                                                                title="Ban User"
                                                            >
                                                                <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                                                                <span className="hidden sm:inline">Ban</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr className="bg-white dark:bg-gray-900">
                                        <td colSpan={isDashboard ? 3 : 6} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="h-6 w-6 text-gray-400 mb-2" />
                                                <p className="font-medium">No users found</p>
                                                {(searchTerm || roleFilter) && (
                                                    <p className="text-xs mt-1">Try adjusting your search or filter</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination Info */}
            {!isDashboard && displayedUsers.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{displayedUsers.length}</span> of{" "}
                            <span className="font-medium">{filteredUsers.length}</span> users
                        </p>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {actionType === "delete" ? "Delete User" :
                                actionType === "ban" ? "Ban User" : "Unban User"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {actionType === "delete" ?
                                `Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.` :
                                actionType === "ban" ?
                                    `Are you sure you want to ban ${selectedUser.firstName} ${selectedUser.lastName}? This will prevent their access to the system.` :
                                    `Are you sure you want to unban ${selectedUser.firstName} ${selectedUser.lastName}? This will restore their access to the system.`
                            }
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`px-4 py-2 rounded-md text-white ${
                                    actionType === "delete" ? "bg-red-600 hover:bg-red-700" :
                                        actionType === "ban" ? "bg-red-600 hover:bg-red-700" :
                                            "bg-emerald-600 hover:bg-emerald-700"
                                } transition-colors`}
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}