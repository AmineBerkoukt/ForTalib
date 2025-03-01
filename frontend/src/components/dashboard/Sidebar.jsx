import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboardIcon, OctagonMinus, UserCog } from 'lucide-react';
import { XMarkIcon } from "@heroicons/react/24/outline";

const SidebarItem = ({ Icon, text, to, isActive }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group
      ${isActive
            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
        }`}
    >
        <Icon
            className={`h-5 w-5 transition-colors duration-200
        ${isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
            }`}
        />
        <span className={`font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
      {text}
    </span>
    </Link>
);

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const location = useLocation();
    const navItems = [
        { Icon: LayoutDashboardIcon, text: "Dashboard", path: "/dashboard" },
        { Icon: UserCog, text: "Users Management", path: "/management" },
        { Icon: OctagonMinus, text: "Banned Users", path: "/bans" }
    ]

    const sidebarContent = (
        <div className="p-4 flex-1 overflow-y-auto">
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        Icon={item.Icon}
                        text={item.text}
                        to={item.path}
                        isActive={location.pathname === item.path}
                    />
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-200 flex flex-col">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <div className={`lg:hidden fixed inset-0 z-50 ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ease-in-out`}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <aside className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                    <div className="p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Menu</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    {sidebarContent}
                </aside>
            </div>
        </>
    )
}

