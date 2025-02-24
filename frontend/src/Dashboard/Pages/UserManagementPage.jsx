import React from 'react'
import UserManagement from '../Components/UserManagement.jsx'
import Layout from "../Components/Layout.jsx";

export default function UserManagementPage() {
    return (
        <Layout>
            <header className="text-left">
                <h1 className={`text-4xl font-bold text-gray-900 dark:text-gray-300`}>
                    Users <span className="text-blue-600">Management</span>
                </h1>
            </header>
            <div className="space-y-6 p-6">
                <UserManagement/>
            </div>
        </Layout>
    )
}