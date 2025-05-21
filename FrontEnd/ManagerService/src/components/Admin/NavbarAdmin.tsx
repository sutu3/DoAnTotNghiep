import { useState } from "react";
import {
    BellIcon,
    ChevronsLeft,
    LogOut,
    Moon,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react";
import HomeIconNavBar from "../../assets/HomeIconNavBar.png";
import { useTheme } from "@/Utils/ThemeContext.tsx";
import { Menu, Transition } from "@headlessui/react";

const NavbarAdmin = ({ collapsed, setCollapsed }) => {
    const { setTheme } = useTheme();
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);

    return (
        <header className="relative z-10 flex h-14 items-center justify-between bg-white px-4 shadow-sm dark:bg-slate-900">
            {/* Left Side */}
            <div className="flex items-center gap-x-3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="size-10 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ChevronsLeft
                        className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                <a
                    href="/"
                    className="flex items-center gap-x-2 rounded-full border-2 border-white bg-blue-100/700 px-4 py-1.5 font-semibold hover:border-blue-100 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                    <img
                        src={HomeIconNavBar}
                        className="w-6 h-6"
                        alt="Home Icon"
                    />
                    <span className={`hidden md:block ${!collapsed ? "lg:block" : "md:hidden"}`}>Home Page</span>
                </a>

                {/* Theme Menu */}
                <Menu as="div" className="relative">
                    <Menu.Button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Sun className="h-5 w-5 dark:hidden" />
                        <Moon className="h-5 w-5 hidden dark:block" />
                    </Menu.Button>
                    <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg dark:bg-gray-800 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setTheme("light")}
                                        className={`block w-full px-4 py-2 text-sm text-left ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        Light
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setTheme("dark")}
                                        className={`block w-full px-4 py-2 text-sm text-left ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        Dark
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setTheme("system")}
                                        className={`block w-full px-4 py-2 text-sm text-left ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        System
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>

                {/* Notification Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <BellIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg dark:bg-gray-800 focus:outline-none">
                            <Menu.Item>
                                <div className="block px-4 py-2 text-sm text-gray-700 dark:text-white">
                                    No new notifications
                                </div>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>

                {/* User Menu */}
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center rounded-full focus:outline-none">
                        <img
                            className="w-8 h-8 rounded-full"
                            src="https://github.com/shadcn.png"
                            alt="User Avatar"
                        />
                    </Menu.Button>
                    <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 focus:outline-none">
                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-white font-semibold">
                                My Account
                            </div>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`flex w-full items-center px-4 py-2 text-sm ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`flex w-full items-center px-4 py-2 text-sm ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`flex w-full items-center px-4 py-2 text-sm text-red-600 ${
                                            active ? "bg-gray-100 dark:bg-blue-950" : ""
                                        }`}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default NavbarAdmin;
