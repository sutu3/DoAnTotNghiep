import {
  Home,
  Warehouse,
  Package,
  PackagePlus,
  Users,
  ShoppingBag,
  Settings,
} from "lucide-react";

export const ManagerLink = [
  // Dashboard
  {
    title: "Warehouse Management",
    links: [
      { label: "Dashboard", icon: Home, path: "/admin" },
      {
        label: "Manage Warehouses",
        icon: Warehouse,
        path: "/admin/warehouses",
      },
      {
        label: "Manage Racks & Bins",
        icon: Warehouse,
        path: "/admin/locations",
      },
      {
        label: "Inventory Overview",
        icon: ShoppingBag,
        path: "/admin/inventory",
      },
      {
        label: "Check Storage Limits",
        icon: Warehouse,
        path: "/admin/storage-alerts",
      },
    ],
  },
  {
    title: "Product Management",
    links: [
      { label: "Products", icon: Package, path: "/admin/products" },
      { label: "Categories", icon: Package, path: "/admin/categories" },
      { label: "Units", icon: Package, path: "/admin/units" },
    ],
  },
  {
    title: "Supplier Management",
    links: [{ label: "Suppliers", icon: Users, path: "/admin/suppliers" }],
  },
  {
    title: "Requests",
    links: [
      {
        label: "Approve Import Requests",
        icon: PackagePlus,
        path: "/admin/import-approvals",
      },
      {
        label: "Approve Export Requests",
        icon: PackagePlus,
        path: "/admin/export-approvals",
      },
      { label: "Return Requests", icon: PackagePlus, path: "/admin/returns" },
    ],
  },
  {
    title: "Task Management",
    links: [
      { label: "Create Task Type", icon: Settings, path: "/admin/taskType" },
      {
        label: "Assign Task",
        icon: Settings,
        path: "/admin/task-assignments",
      },
    ],
  },
  {
    title: "Users & Settings",
    links: [
      { label: "Users", icon: Users, path: "/admin/users" },
      { label: "Roles & Permissions", icon: Settings, path: "/admin/roles" },
      { label: "Settings", icon: Settings, path: "/admin/settings" },
    ],
  },
];
