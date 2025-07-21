import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

import DashboardIcon from "../../assets/DashboardIcon.png";


interface AppSidebarProps {
    collapsed: boolean;
    navbarLinks: any[]; // Thêm prop này
}

const AppSidebar = forwardRef<HTMLElement, AppSidebarProps>(
    ({ collapsed, navbarLinks }, ref) => {
    return (
      <aside
        ref={ref}
        className={`
        fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-r-slate-300 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900
        ${collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]"} 
        ${collapsed ? "max-md:-left-full" : "max-md:left-0"}
      `}
      >
        <div className="flex items-center gap-x-3 p-3">
          <img
            alt="Main-Logo"
            className="block"
            height={35}
            src={DashboardIcon}
            width={35}
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
              className={`sidebar-group ${collapsed ? "md:items-center" : ""}`}
            >
              <p
                className={`sidebar-group-title ${collapsed ? "md:w-[45px]" : ""}`}
              >
                {nav.title}
              </p>

              {nav.links.map((link, index_2) => (
                <NavLink
                  key={index_2}
                  end
                  className={`sidebar-item ${collapsed ? "md:w-[45px]" : ""}`}
                  to={link.path}
                >
                  <link.icon className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200" />
                  {!collapsed && (
                    <p className="whitespace-nowrap">{link.label}</p>
                  )}
                </NavLink>
              ))}
            </nav>
          ))}
        </div>
      </aside>
    );
  },
);

AppSidebar.displayName = "AppSidebar";

export default AppSidebar;
