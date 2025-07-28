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
import StackPage from "@/pages/Stack/page.tsx";
import Task from "@/pages/TaskType/page.tsx";
import GroupUnit from "@/pages/Unit/page.tsx";
import DetailUnit from "@/pages/Unit/DetailUnit/page.tsx";
import CategoryPage from "@/pages/Category/page.tsx";
import AddNewSupplierPage from "@/pages/Supplier/Addnew/page.tsx";
import ProductPage from "@/pages/Product/page.tsx";
import LoginPage from "@/pages/Login/page.tsx";
import OrderRequestImportForm from "@/pages/OrderImport/page.tsx";
import MyTasksPage from "@/pages/TaskType/Tasks/Staff/page.tsx";
import ExecuteExportPage from "@/pages/ExecuteExport/page.tsx";
import CreateExportOrderPage from "@/pages/OrderExport/page.tsx";
import StackDetailPage from "@/pages/Stack/Bin/page.tsx";
import AdminImportOrderManagement from "@/pages/ApproveOrderImport/page.tsx";
import InventoryOverviewPage from "@/pages/Inventory/OverView/page.tsx";
import AddProductPage from "@/pages/Product/Addnew/AddProductPage.tsx";
import StorageLimitsPage from "@/pages/StorageLimits/page.tsx";
import AdminExportOrderManagement from "@/pages/ApproveOrderExport/page.tsx";
import Daskboard from "@/pages/Dashboard/page.tsx";
import EditSupplierPage from "@/pages/Supplier/Edit/EditSupplierPage.tsx";
import ImportOrderDetailsPage from "@/pages/ExecuteImport/Detail/page.tsx";
import TaskAssignmentsPage from "@/pages/TaskAssignments/page.tsx";
import CreateTaskAssignmentPage from "@/pages/TaskType/CreateTask/CreateTaskAssignmentPage";
import EmployeeInventoryCheckPage from "@/pages/InventoryCheck/page.tsx";
import WarehousePage from "@/pages/WarehouseManager/page.tsx";
import EditProductPage from "@/pages/Product/Edit/EditProductPage.tsx";
import AddWarehousePage from "@/pages/WarehouseManager/AddNew/AddWarehousePage.tsx";
import SupplierPage from "@/pages/Supplier/page";
import WarehouseReceiptManagementPage from "@/pages/ExecuteImport/page.tsx";

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
      { path: "/admin/products", element: <ProductPage /> },
      { path: "/admin/products/edit", element: <EditProductPage /> },
      { path: "/admin/products/addnew", element: <AddProductPage /> },
      { path: "/admin/users", element: <User /> },
      { path: "/admin/", element: <Daskboard /> },
      { path: "/admin/locations", element: <StackPage /> },
      { path: "/admin/locations/stack", element: <StackDetailPage /> },
      { path: "/admin/tasks", element: <Task /> },
      {path: "/admin/task-assignments/create", element: <CreateTaskAssignmentPage />},
      { path: "/admin/unitType", element: <DetailUnit /> },
      { path: "/admin/units", element: <GroupUnit /> },
      { path: "/admin/categories", element: <CategoryPage /> },
      { path: "/admin/suppliers", element: <SupplierPage /> },
      { path: "/admin/supplier/edit", element: <EditSupplierPage /> },
      { path: "/admin/suppliers/addnew", element: <AddNewSupplierPage /> },
      { path: "/admin/import-approvals", element: <AdminImportOrderManagement /> },
      { path: "/admin/storage-alerts", element: <StorageLimitsPage /> },
      { path: "/admin/export-approvals", element: <AdminExportOrderManagement /> },
      { path: "/admin/inventory", element: <InventoryOverviewPage /> },
      { path: "/admin/warehouses", element: <WarehousePage /> },
      { path: "/admin/warehouses/addnew", element: <AddWarehousePage /> },
      { path: "/admin/task-assignments", element: <TaskAssignmentsPage /> },
      { path: "/staff/request-import", element: <OrderRequestImportForm /> },
      { path: "/staff/tasks", element: <MyTasksPage /> },
      { path: "/staff/import", element: <WarehouseReceiptManagementPage /> },
      { path: "/staff/import/details", element: <ImportOrderDetailsPage /> },
      { path: "/staff/export", element: <ExecuteExportPage /> },
      { path: "/staff/request-export", element: <CreateExportOrderPage /> },
      { path: "/staff/check-inventory", element: <EmployeeInventoryCheckPage /> },

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
