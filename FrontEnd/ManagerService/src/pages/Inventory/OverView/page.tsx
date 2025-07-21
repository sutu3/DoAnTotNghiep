// FrontEnd/ManagerService/src/pages/Inventory/Overview/page.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { warehouseSelector } from "@/Store/Selector.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import LowStockAlert from "@/components/Admin/Inventory/Overview/LowStockAlert.tsx";
import ExpiringProducts from "@/components/Admin/Inventory/Overview/ExpiringProducts.tsx";
import RecentMovements from "@/components/Admin/Inventory/Overview/RecentMovements.tsx";
import InventoryStatsCards from "@/components/Admin/Inventory/Overview/Card/InventoryStatsCards.tsx";
import {MiddleLoadAllInventoryData} from "@/Store/Thunk/InventoryOverviewThunk.tsx";
import WarehouseCapacity from "@/components/Admin/Inventory/Overview/WarehouseCapacity.tsx";

const InventoryOverviewPage = () => {
    const dispatch = useDispatch();
    const warehouse = useSelector(warehouseSelector);
    const isSidebarCollapsed = localStorage.getItem("theme") === "light";

    useEffect(() => {
        if (warehouse?.warehouseId) {
            // Load tất cả dữ liệu inventory
            const fetch=async ()=>{
                await (dispatch as any)(MiddleLoadAllInventoryData(warehouse.warehouseId));
            }
            fetch()
        }
    }, [warehouse?.warehouseId]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Inventory Overview
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Monitor your warehouse inventory status
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <InventoryStatsCards />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LowStockAlert />
                    <ExpiringProducts />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentMovements />
                    <WarehouseCapacity />
                </div>
                {/* Recent Movements */}


            </div>
        </div>
    );
};

export default InventoryOverviewPage;