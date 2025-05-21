import {
    Home,
    Package,
    PackagePlus,
    ShoppingBag,
    Settings
} from "lucide-react";

export const Staff = [
    {
        title: "Tasks",
        links: [
            { label: "My Tasks", icon: Home, path: "/staff/tasks" },
            { label: "Execute Import", icon: PackagePlus, path: "/staff/import" },
            { label: "Execute Export", icon: PackagePlus, path: "/staff/export" },
            { label: "Execute Return", icon: PackagePlus, path: "/staff/returns" },
            { label: "Check Inventory", icon: ShoppingBag, path: "/staff/check-inventory" }
        ]
    },
    {
        title: "Requests",
        links: [
            { label: "Create Import Request", icon: Package, path: "/staff/request-import" },
            { label: "Create Export Request", icon: Package, path: "/staff/request-export" },
            { label: "Create Return Request", icon: Package, path: "/staff/request-return" }
        ]
    },
    {
        title: "Users & Settings",
        links: [
            { label: "Settings", icon: Settings, path: "/staff/settings" }
        ]
    }

];
