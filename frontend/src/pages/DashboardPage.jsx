import React from 'react'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardStats from '../components/dashboard/DashboardStats.jsx'
import UserManagement from '../components/dashboard/UserManagement.jsx'
import Layout from "../components/dashboard/Layout.jsx"
import { motion } from 'framer-motion'

export default function DashboardPage() {
    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 p-4 sm:p-6"
            >
                <DashboardHeader />

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <DashboardStats />
                    </motion.div>

                    {/* Right Side - User Management */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <UserManagement isDashboard={true} />
                    </motion.div>
                </div>
            </motion.div>
        </Layout>
    )
}