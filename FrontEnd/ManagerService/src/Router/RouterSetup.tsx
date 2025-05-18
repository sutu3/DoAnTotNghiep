// RouterSetup.tsx
import { RouterProvider, createBrowserRouter, useNavigate, useHref } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "@/pages/LoginPage.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import { CheckAuth } from "@/Utils/CheckAuth.tsx";
import { Provider } from "@/provider.tsx";
import { HeroUIProvider } from "@heroui/system";

// Step 1: Tạo router
const router = createBrowserRouter([
    {
        path: "/",
        element: <AdminLayout />,
        loader: CheckAuth,
        children: [
            { path: "*", element: <PageNotFound /> },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
]);

// Step 2: Bọc Provider và HeroUIProvider bên trong RouterProvider
export default function RouterSetup() {
    return (
        <RouterProvider router={router}>
            <HeroWrapper />
        </RouterProvider>
    );
}

// Step 3: HeroUI cần nằm trong context của Router
function HeroWrapper() {
    const navigate = useNavigate();
    const href = useHref();

    return (
        <HeroUIProvider navigate={navigate} useHref={href}>
            <Provider>
                {/* Dùng lại router.children từ Provider nếu cần */}
            </Provider>
        </HeroUIProvider>
    );
}
