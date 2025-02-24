import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    UserIcon,
    BookmarkIcon,
    ArchiveBoxArrowDownIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarFBFilter from "./SidebarFBFilter";

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

const SidebarFB = () => {
    const location = useLocation();
    const { selectedUser } = useChatStore();
    const { role } = useAuthStore();

    const navItems = [
        { Icon: UserIcon, text: "Profile", path: "/profile" },
        { Icon: BookmarkIcon, text: "Saved", path: "/saved" },
        ...(role === "student" ? [{
            Icon: ArchiveBoxArrowDownIcon,
            text: "Apply for HouseOwner",
            path: "/applyforhouseowner"
        }] : []),
        ...(role === "admin" ? [{
            Icon: CalendarIcon,
            text: "Dashboard",
            path: "/dashboard"
        }] : [])
    ];

    return (
        <aside className="w-full lg:w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      shadow-sm transition-all duration-200 flex flex-col">
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

                {location.pathname === "/" && (
                    <>
                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                        <SidebarFBFilter />
                    </>
                )}
            </div>
        </aside>
    );
};

export default SidebarFB;