import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useHref,
} from "react-router-dom";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { ToastProvider } from "@heroui/react";

import LoginPage from "@/pages/LoginPage.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import { CheckAuth } from "@/Utils/CheckAuth.tsx";
import { ProviderUI } from "@/providerUI.tsx";
import Product from "@/pages/Product/Product.tsx";
import User from "@/pages/User/page.tsx";
import store from "@/Store/Store.tsx";
import WarehousePage from "@/pages/Dashboard/page.tsx";
import StackPage from "@/pages/Stack/page.tsx";
import Task from "@/pages/TaskType/page.tsx";
import TasksPage from "@/pages/TaskType/Tasks/page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <HeroUIProviderWrapper>
        <AdminLayout />
      </HeroUIProviderWrapper>
    ),
    loader: CheckAuth,
    children: [
      { path: "*", element: <PageNotFound /> },
      { path: "admin/products", element: <Product /> },
      { path: "/admin/users", element: <User /> },
      { path: "/admin/", element: <WarehousePage /> },
      { path: "/admin/locations", element: <StackPage /> },
      { path: "/admin/taskType", element: <Task /> },
      { path: "/admin/tasks", element: <TasksPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

export default function RouterSetup() {
  return <RouterProvider router={router} />;
}

function HeroUIProviderWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const useHrefFn = (href: string) => useHref(href);
  return (
    <HeroUIProvider navigate={navigate} useHref={useHrefFn}>
      <ToastProvider />
      <Provider store={store}>
        <ProviderUI>{children}</ProviderUI>
      </Provider>
    </HeroUIProvider>
  );
}
