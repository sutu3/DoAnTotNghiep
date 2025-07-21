// src/layouts/AdminLayouts.tsx (hoặc vị trí của bạn)
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive"; // Cần cài đặt: npm install react-responsive

import AppSidebar from "@/components/Admin/AppSidebar";
import NavbarAdmin from "@/components/Admin/NavbarAdmin";
import { useClickOutside } from "@/Hooks/use-click-outside"; // Đảm bảo import đúng
import { ThemeProvider } from "@/Utils/ThemeContext";
import { LayoutProvider, useLayout } from "@/layouts/LayoutContext.tsx";
import {ManagerLink} from "@/Constants/ManagerLink.tsx";
import {Staff} from "@/Constants/Staff.tsx";
import {useAuth} from "@/Hooks/useAuth.ts";
// @ts-ignore

const AdminLayoutContent = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isActuallyDesktop = useMediaQuery({ query: "(min-width: 768px)" });
    const { userRole, isAuthenticated } = useAuth();
    const navbarLinks = userRole === "manager" ? ManagerLink : Staff;

    useClickOutside(sidebarRef, () => {
    if (!isActuallyDesktop && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
        <div
            // Chỉ sử dụng inert khi sidebar đang đóng (collapsed)
            {...(isSidebarCollapsed ? { inert: true } : {})}
            aria-label="Close sidebar"
            className={`pointer-events-none fixed inset-0 z-40 bg-black opacity-0 transition-opacity md:hidden  
              ${!isSidebarCollapsed && "pointer-events-auto opacity-30"}`}
            role="button"
            tabIndex={!isSidebarCollapsed ? 0 : -1}  // Chỉ focusable khi sidebar mở
            onClick={() => setIsSidebarCollapsed(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setIsSidebarCollapsed(true);
                }
            }}
        />

      {/* 1. Thanh Sidebar */}
        <AppSidebar
            ref={sidebarRef}
            collapsed={isSidebarCollapsed}
            navbarLinks={navbarLinks}
        />

      {/* 2. Phần Navbar và Content */}
      <div
        className={`transition-[margin-left] duration-300 ease-in-out
                  ${isSidebarCollapsed ? "md:ml-[70px]" : "md:ml-[240px]"}`}
      >
        {/* 2.1: Header Navbar */}
        <NavbarAdmin
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />

        {/* 2.2: Phần nội dung */}
        <div className="h-[calc(100vh)] overflow-y-auto overflow-x-hidden">
          <Outlet /> {/* Outlet render các route con, không cần props */}
        </div>
      </div>
    </div>
  );
};

const AdminLayouts = () => {
  // Xác định trạng thái ban đầu của sidebar dựa trên kích thước màn hình
  // `useMediaQuery` cần chạy ở top-level của component hoặc custom hook
  const isInitiallyDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const initialCollapsedState = !isInitiallyDesktop;

  return (
    <ThemeProvider>
      <LayoutProvider initialCollapsed={initialCollapsedState}>
        <AdminLayoutContent />
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default AdminLayouts;
