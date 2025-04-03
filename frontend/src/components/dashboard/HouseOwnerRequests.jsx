import React, { useEffect, useState } from 'react';
import { Check, X, Search, Filter, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { useRequestStore } from '../../store/useRequestStore';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

export default function HouseOwnerRequests({ isDashboard = false }) {
    const { requests, fetchRequests, updateRequestStatus } = useRequestStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleUpdateStatus = async (id, status) => {
        const validStatuses = ['accepted', 'rejected'];
        if (!validStatuses.includes(status.toLowerCase())) {
            toast.error("Invalid status. Must be 'accepted' or 'rejected'.");
            return;
        }

        const request = requests.find((req) => req._id === id);
        if (!request) {
            toast.error("Request not found.");
            return;
        }

        if (request.status !== 'pending') {
            toast.error("This request has already been processed.");
            return;
        }

        const updatedRequests = requests.map((req) =>
            req._id === id ? { ...req, status: status.toLowerCase(), treatedAt: new Date().toISOString() } : req
        );

        useRequestStore.setState({ requests: updatedRequests });

        await updateRequestStatus(id, status);
    };

    const filteredRequests = requests.filter((request) => {
        const userFullName = request.userId
            ? `${request.userId.firstName} ${request.userId.lastName}`.toLowerCase()
            : '';
        const matchesSearch = userFullName.includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === 'All' || (request.status && request.status.toLowerCase() === selectedStatus.toLowerCase());

        return matchesSearch && matchesStatus;
    });

    const displayedRequests = isDashboard ? filteredRequests.slice(0, 5) : filteredRequests;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    House Owner Requests
                </h2>
                {isDashboard && (
                    <button
                        onClick={() => navigate('/requests')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                )}
            </div>

            {!isDashboard && (
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full sm:w-64 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full sm:w-40 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                            <option value="All">All</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
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
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                {!isDashboard && (
                                    <>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Created At</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Treated At</th>
                                    </>
                                )}
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {displayedRequests.map((request) => (
                                    <motion.tr
                                        key={request._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-gray-900"
                                    >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                                            {request.userId?.firstName} {request.userId?.lastName}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    request.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                        request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                }`}>
                                                    {request.status}
                                                </span>
                                        </td>
                                        {!isDashboard && (
                                            <>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                    {request.status.toLowerCase() === 'pending' ? "" : (request.treatedAt ? new Date(request.treatedAt).toLocaleDateString() : "Not Treated Yet")}
                                                </td>
                                            </>
                                        )}
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex items-center justify-end space-x-2">
                                                {request.status.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(request._id, 'Accepted')}
                                                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                        >
                                                            <Check className="h-5 w-5 mr-1"/>
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                                                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                                        >
                                                            <X className="h-5 w-5 mr-1"/>
                                                            Reject
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

