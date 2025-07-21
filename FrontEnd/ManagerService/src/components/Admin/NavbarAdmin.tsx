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
import { Menu, Transition } from "@headlessui/react";

import HomeIconNavBar from "../../assets/HomeIconNavBar.png";

import { useTheme } from "@/Utils/ThemeContext.tsx";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {useNavigate} from "react-router-dom";

// @ts-ignore
const NavbarAdmin = ({ collapsed, setCollapsed }) => {
  // @ts-ignore
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetchApi({
        method: "POST",
        url: API_ROUTES.Authen.Authen().logout,
        body:{token:token},
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      showToast({
        title: "Success",
        description: "GoodBye",
        color: "success",
      });

      // Đợi 2 giây rồi mới xóa token và chuyển trang
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login"); // hoặc window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      console.error("Lỗi khi đăng xuất:", error.message);
      alert("Đăng xuất thất bại: " + error.message);
    }
  };
  return (
    <header className="relative z-10 flex h-14 items-center justify-between bg-white px-4 shadow-sm dark:bg-slate-900">
      {/* Left Side */}
      <div className="flex items-center gap-x-3">
        <button
          className="size-10 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            className="w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-gray-700 dark:text-white"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <a
          className="flex items-center gap-x-2 rounded-full border-2 border-white bg-blue-100/700 px-4 py-1.5 font-semibold hover:border-blue-100 dark:bg-gray-800 dark:hover:bg-gray-600"
          href="/"
        >
          <img alt="Home Icon" className="w-6 h-6" src={HomeIconNavBar} />
          <span
            className={`hidden md:block ${!collapsed ? "lg:block" : "md:hidden"}`}
          >
            Home Page
          </span>
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
                    className={`block w-full px-4 py-2 text-sm text-left ${
                      active ? "bg-gray-100 dark:bg-blue-950" : ""
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`block w-full px-4 py-2 text-sm text-left ${
                      active ? "bg-gray-100 dark:bg-blue-950" : ""
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`block w-full px-4 py-2 text-sm text-left ${
                      active ? "bg-gray-100 dark:bg-blue-950" : ""
                    }`}
                    onClick={() => setTheme("system")}
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
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
              src="https://github.com/shadcn.png"
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
                      onClick={()=>handleLogOut()}
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
