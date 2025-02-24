import React from 'react'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardStats from '../components/dashboard/DashboardStats.jsx'
import HouseOwnerRequests from '../components/dashboard/HouseOwnerRequests.jsx'
import UserManagement from '../components/dashboard/UserManagement.jsx'
import Layout from "../components/dashboard/Layout.jsx";

export default function RequestsPage() {
    return (
        <Layout>
            <header className="text-left">
                <h1 className={`text-4xl font-bold text-gray-900 dark:text-gray-300`}>
                    House <span className="text-blue-600">Owner Requests</span>
                </h1>
            </header>
            <div className="space-y-6 p-6">
                <HouseOwnerRequests/>
            </div>
        </Layout>
    )
}