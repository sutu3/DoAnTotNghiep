import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useHref,
} from "react-router-dom";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { ToastProvider } from "@heroui/react";

import AdminLayout from "@/layouts/AdminLayout.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import { CheckAuth } from "@/Utils/CheckAuth.tsx";
import { ProviderUI } from "@/providerUI.tsx";
import User from "@/pages/User/page.tsx";
import store from "@/Store/Store.tsx";
import WarehousePage from "@/pages/Dashboard/page.tsx";
import StackPage from "@/pages/Stack/page.tsx";
import Task from "@/pages/TaskType/page.tsx";
import TasksPage from "@/pages/TaskType/Tasks/page.tsx";
import GroupUnit from "@/pages/Unit/page.tsx";
import DetailUnit from "@/pages/Unit/DetailUnit/page.tsx";
import CategoryPage from "@/pages/Category/page.tsx";
import SupplierPage from "@/pages/Supplier/page.tsx";
import AddNewSupplierPage from "@/pages/Supplier/Addnew/page.tsx";
import ProductPage from "@/pages/Product/page.tsx";
import AddNewProductPage from "@/pages/Product/Addnew/page.tsx";
import LoginPage from "@/pages/Login/page.tsx";
import OrderRequestImportForm from "@/pages/OrderImport/page.tsx";
import MyTasksPage from "@/pages/TaskType/Tasks/Staff/page.tsx";
import ExecuteImportPage from "@/pages/ExecuteImport/page.tsx";
import ExecuteExportPage from "@/pages/ExecuteExport/page.tsx";
import CreateExportOrderPage from "@/pages/OrderExport/page.tsx";
import StackDetailPage from "@/pages/Stack/Bin/page.tsx";
import AdminImportOrderManagement from "@/pages/ApproveOrderImport/page.tsx";

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
      { path: "admin/products", element: <ProductPage /> },
      { path: "/admin/products/addnew", element: <AddNewProductPage /> },
      { path: "/admin/users", element: <User /> },
      { path: "/admin/", element: <WarehousePage /> },
      { path: "/admin/locations", element: <StackPage /> },
      { path: "/admin/locations/stack", element: <StackDetailPage /> },
      { path: "/admin/taskType", element: <Task /> },
      { path: "/admin/tasks", element: <TasksPage /> },
      { path: "/admin/unitType", element: <DetailUnit /> },
      { path: "/admin/units", element: <GroupUnit /> },
      { path: "/admin/categories", element: <CategoryPage /> },
      { path: "/admin/suppliers", element: <SupplierPage /> },
      { path: "/admin/suppliers/addnew", element: <AddNewSupplierPage /> },
      { path: "/admin/import-approvals", element: <AdminImportOrderManagement /> },
      { path: "/staff/request-import", element: <OrderRequestImportForm /> },
      { path: "/staff/tasks", element: <MyTasksPage /> },
      { path: "/staff/import", element: <ExecuteImportPage /> },
      { path: "/staff/export", element: <ExecuteExportPage /> },
      { path: "/staff/request-export", element: <CreateExportOrderPage /> },
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
