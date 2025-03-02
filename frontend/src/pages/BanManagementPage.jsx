import React from 'react'
import Layout from "../components/dashboard/Layout.jsx";
import BannedManagement from "../components/dashboard/BannedManagement.jsx";

export default function BanManagementPage() {
    return (
        <Layout>
            <header className="text-left">
                <h1 className={`text-4xl font-bold text-gray-900 dark:text-gray-300`}>
                    <span className="text-red-700">Banned</span> Users
                </h1>
            </header>
            <div className="space-y-6 p-6">
                <BannedManagement/>
            </div>
        </Layout>
    )
}