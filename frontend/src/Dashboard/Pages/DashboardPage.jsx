import React from 'react'
import DashboardHeader from '../Components/DashboardHeader.jsx'
import DashboardStats from '../Components/DashboardStats.jsx'
import HouseOwnerRequests from '../Components/HouseOwnerRequests.jsx'
import UserManagement from '../Components/UserManagement.jsx'
import Layout from "../Components/Layout.jsx";

export default function DashboardPage() {
    return (
        <Layout>
        <div className="space-y-6 p-6">
            <DashboardHeader />
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HouseOwnerRequests />
                <UserManagement />
            </div>
        </div>
        </Layout>
    )
}

