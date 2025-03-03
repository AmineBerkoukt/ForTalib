import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore.js";
import { useBanStore } from "../../store/useBanStore.js";
import { Eye, UserPlus, Trash, Search, Filter, ChevronRight, Ban, Menu, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import LoadingDelete from "../skeletons/LoadingDelete.jsx";

export default function UserManagement({ isDashboard = false }) {
    const users = useUserStore(state => state.users);
    const loading = useUserStore(state => state.loading);
    const error = useUserStore(state => state.error);
    const fetchUsers = useUserStore(state => state.fetchUsers);
    const makeAdmin = useUserStore(state => state.makeAdmin);
    const deleteUser = useUserStore((state) => state.deleteUser);
    const { loading: banLoading, toggleLoading } = useBanStore();

    // Ban functionality
    const { banUser, bannedUsers, getBannedUsers } = useBanStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState("");
    const navigate = useNavigate();


    const handleUserAction = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        setShowConfirmModal(true);
        setActionMenuOpen(null);
    };

    const confirmAction = async () => {
        try {
            if (actionType === "delete") {
                await deleteUser(selectedUser._id);
            } else if (actionType === "ban") {
                await banUser(selectedUser._id);
                await fetchUsers();
            } else if (actionType === "admin") {
                await makeAdmin(selectedUser._id);
            }
            setShowConfirmModal(false);
        } catch (error) {
            console.error(`Error performing ${actionType} action:`, error);
        }
    };

    const roleDisplayNames = {
        admin: "Admin",
        student: "Student",
    };

    useEffect(() => {
        fetchUsers();
        getBannedUsers(); // Fetch banned users when component mounts
    }, [fetchUsers, getBannedUsers]);

    // Check if a user is banned
    const isUserBanned = (userId) => {
        return bannedUsers.some(banned => banned._id === userId);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const displayedUsers = isDashboard ? filteredUsers.slice(0, 5) : filteredUsers;

    if (banLoading) {
        return (
            <LoadingDelete/>
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
        setActionMenuOpen(null);
    };

    const toggleActionMenu = (userId) => {
        setActionMenuOpen(actionMenuOpen === userId ? null : userId);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-lg shadow-sm p-2 sm:p-4 bg-white dark:bg-gray-800 max-w-full overflow-hidden"
        >
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Users <span className="text-blue-600"> Management </span>
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
                <div className="flex flex-col sm:flex-row justify-between items-stretch mb-4 space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                    <div className="relative flex-grow max-w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="relative flex-grow max-w-full sm:max-w-xs">
                        <select
                            className="pl-10 pr-3 py-2 w-full border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            )}

            {/* Mobile card view for small screens */}
            <div className="block sm:hidden">
                <AnimatePresence>
                    {displayedUsers.map((user) => (
                        <motion.div
                            key={user._id || `mobile-${user.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-900 p-4 mb-2 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-200">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    {!isDashboard && (
                                        <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
                                    )}
                                </div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' :
                                        user.role === 'student' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                            'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                }`}>
                                    {roleDisplayNames[user.role] || user.role}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                    onClick={() => handleNavigateToProfile(user._id)}
                                    className="flex items-center px-2 py-1 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-xs"
                                >
                                    <Eye className="h-3 w-3 mr-1"/> Profile
                                </button>
                                {!isDashboard && (
                                    <>
                                        {user.role !== "admin" ? (
                                            <button
                                                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center text-xs"
                                                onClick={() => handleUserAction(user, "admin")}
                                            >
                                                <UserPlus className="h-3 w-3 mr-1"/> Make Admin
                                            </button>
                                        ) : (
                                            <button
                                                className="px-2 py-1 bg-green-500 text-white rounded-md flex items-center opacity-50 cursor-not-allowed text-xs"
                                                disabled
                                            >
                                                Already Admin
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleUserAction(user, "delete")}
                                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center text-xs"
                                        >
                                            <Trash className="h-3 w-3 mr-1"/> Delete
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(user, "ban")}
                                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center text-xs"
                                        >
                                            <Ban className="h-3 w-3 mr-1"/> Ban
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">Name</th>
                                {!isDashboard && (
                                    <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Email</th>
                                )}
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Role</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {displayedUsers.map((user) => (
                                <motion.tr
                                    key={user._id || `desktop-${user.id}`}
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
                                        <div className="hidden md:flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleNavigateToProfile(user._id)}
                                                className="flex items-center px-2 py-1 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
                                            >
                                                <Eye className="h-4 w-4 mr-1"/> Profile
                                            </button>
                                            {!isDashboard && (
                                                <>
                                                    {user.role !== "admin" ? (
                                                        <button
                                                            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                                            onClick={() => handleUserAction(user, "admin")}
                                                        >
                                                            <UserPlus className="h-4 w-4 mr-1"/> Make Admin
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="px-2 py-1 bg-green-500 text-white rounded-md flex items-center opacity-50 cursor-not-allowed"
                                                            disabled
                                                        >
                                                            Already Admin
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUserAction(user, "delete")}
                                                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                                                    >
                                                        <Trash className="h-4 w-4 mr-1"/> Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user, "ban")}
                                                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                                                    >
                                                        <Ban className="h-4 w-4 mr-1"/> Ban
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Tablet dropdown menu */}
                                        <div className="md:hidden relative">
                                            <button
                                                onClick={() => toggleActionMenu(user._id)}
                                                className="flex items-center justify-center px-2 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <Menu className="h-5 w-5" />
                                            </button>

                                            {actionMenuOpen === user._id && (
                                                <div className="absolute right-0 top-full mt-1 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button
                                                            onClick={() => handleNavigateToProfile(user._id)}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2"/> Profile
                                                        </button>

                                                        {!isDashboard && (
                                                            <>
                                                                {user.role !== "admin" ? (
                                                                    <button
                                                                        onClick={() => handleUserAction(user, "admin")}
                                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                                    >
                                                                        <UserPlus className="h-4 w-4 mr-2"/> Make Admin
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="flex items-center px-4 py-2 text-sm text-gray-400 dark:text-gray-500 w-full text-left opacity-50 cursor-not-allowed"
                                                                        disabled
                                                                    >
                                                                        <UserPlus className="h-4 w-4 mr-2"/> Already Admin
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => handleUserAction(user, "delete")}
                                                                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                                >
                                                                    <Trash className="h-4 w-4 mr-2"/> Delete
                                                                </button>

                                                                <button
                                                                    onClick={() => handleUserAction(user, "ban")}
                                                                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                                >
                                                                    <Ban className="h-4 w-4 mr-2"/> Ban
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {displayedUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found. Try adjusting your search or filter.
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            {actionType === "delete" ? (
                                <><AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Delete User</>
                            ) : actionType === "ban" ? (
                                <><Ban className="h-5 w-5 mr-2 text-red-600" /> Ban User</>
                            ) : (
                                <><UserPlus className="h-5 w-5 mr-2 text-blue-600" /> Make Admin</>
                            )}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 ml-7">
                            {actionType === "delete" ?
                                `Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.` :
                                actionType === "ban" ?
                                    `Are you sure you want to ban ${selectedUser.firstName} ${selectedUser.lastName}? This will prevent their access to the system.` :
                                    `Are you sure you want to make ${selectedUser.firstName} ${selectedUser.lastName} an admin? This will grant them full administrative privileges.`
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
                                            "bg-blue-600 hover:bg-blue-700"
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