import React from 'react'
import DashboardHeader from '../Components/DashboardHeader.jsx'
import DashboardStats from '../Components/DashboardStats.jsx'
import HouseOwnerRequests from '../Components/HouseOwnerRequests.jsx'
import UserManagement from '../Components/UserManagement.jsx'
import Layout from "../Components/Layout.jsx";

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