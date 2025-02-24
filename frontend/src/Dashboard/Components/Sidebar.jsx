import React from 'react'
import {BookmarkIcon, CalendarIcon, UserIcon, UsersIcon} from "@heroicons/react/24/outline/index.js";
import {Link} from "react-router-dom";
import {LayoutDashboardIcon, HousePlus, UserCog, UserPlus} from "lucide-react";

const SidebarItem = ({ Icon, text, to }) => (
    <Link
        to={to}
        className="flex items-center space-x-3 p-3 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
    >
        <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
    </Link>
);

export default function Sidebar() {
    return (
        <div className="w-60 p-5 bg-white dark:bg-gray-900 shadow-md h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <ul className="space-y-0.5">
                    <SidebarItem Icon={LayoutDashboardIcon} text="Dashboard" to="/dashboard"/>
                    <SidebarItem Icon={HousePlus} text="House Owner Request" to="/requests"/>
                    <SidebarItem Icon={UserCog} text="Users Management" to="/management"/>
                </ul>

            </div>
        </div>
    )
}
