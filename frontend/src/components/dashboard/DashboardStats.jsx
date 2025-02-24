import React, { useEffect } from "react";
import { Users, Home, FileText } from 'lucide-react';
import { useStatsStore } from "../../store/useStatsStore.js";
import { motion } from 'framer-motion';

const stats = [
    { name: "Total Users", icon: Users, color: "bg-blue-500" },
    { name: "House Owners", icon: Home, color: "bg-green-500" },
    { name: "Total Posts", icon: FileText, color: "bg-purple-500" },
];

export default function DashboardStats() {
    const { totalUsers, houseOwners, houseOwnersPercentage, totalPosts, loading, error, fetchStats } = useStatsStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between overflow-hidden relative"
                    >
                        <div className={`absolute top-0 left-0 w-2 h-full ${item.color}`}></div>
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.name}
                            </p>
                            <div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
                                <Icon
                                    className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {loading ? (
                                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
                            ) : error ? (
                                <span className="text-red-500 text-lg">{error}</span>
                            ) : (
                                <>
                                    {item.name === "House Owners" && (
                                        <div className="flex flex-col">
                                            <span className="text-3xl">{houseOwnersPercentage}%</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {houseOwners} House Owners
                                            </span>
                                        </div>
                                    )}
                                    {item.name === "Total Users" && totalUsers}
                                    {item.name === "Total Posts" && totalPosts}
                                </>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

