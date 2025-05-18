import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "../../assets/DashboardIcon.png";

import { navbarLinks } from "@/Constants/NavbarLink.tsx";

const AppSidebar = forwardRef(({ collapsed }, ref) => {
    return (
    <aside
      ref={ref}
            className={
                `fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-r-slate-300 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900
                ${collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]"} 
                ${collapsed ? "max-md:-left-full" : "max-md:left-0"}`
            }
        >
            <div className="flex items-center gap-x-3 p-3">
                <img
                    src={DashboardIcon}
          alt="Main-Logo"
          width={35}
                    height={35}
                    className="block"
                />
                {!collapsed && (
                    <p className="text-lg font-bold whitespace-nowrap text-slate-900 dark:text-slate-50">
                        Manager Admin
                    </p>
                )}
            </div>

            <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3 scrollbar-thin">
                {navbarLinks.map((nav, index) => (
                    <nav
                        key={index}
                        className={`sidebar-group ${ collapsed && "md:items-center"}`}
                    >
                        <p className={`sidebar-group-title ${collapsed && "md:w-[45px]"}`}>
                            {nav.title}
                        </p>

                        {nav.links.map((link, index_2) => (
                            <NavLink
                                key={index_2}
                                to={link.path}
                                end
                                className={`sidebar-item ${collapsed && "md:w-[45px]"}`}
                            >
                                <link.icon className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200" />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

AppSidebar.displayName = "Sidebar";

export default AppSidebar;
