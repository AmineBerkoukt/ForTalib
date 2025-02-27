import React, {useEffect} from "react";
import {Users, FileText, UserCog} from 'lucide-react';
import {useStatsStore} from "../../store/useStatsStore.js";
import {motion} from 'framer-motion';

const StatCard = ({title, value, icon: Icon, color, loading, error, delay}) => (
    <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, delay}}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
    >
        <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
            </h3>
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-15 transition-colors duration-200`}>
                <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} aria-hidden="true"/>
            </div>
        </div>
        <div className="mt-2">
            {loading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
            ) : error ? (
                <span className="text-red-500 text-lg">{error}</span>
            ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </span>
            )}
        </div>
    </motion.div>
);

export default function DashboardStats() {
    const {totalUsers, totalPosts, loading, error, fetchStats} = useStatsStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
    <>
        <div className="space-y-6">
            <StatCard
                title="Total Users"
                value={totalUsers}
                icon={Users}
                color="bg-blue-500"
                loading={loading}
                error={error}
                delay={0}
            />
            <StatCard
                title="Total Posts"
                value={totalPosts}
                icon={FileText}
                color="bg-purple-500"
                loading={loading}
                error={error}
                delay={0.1}
            />
        </div>
    </>


)
    ;
}