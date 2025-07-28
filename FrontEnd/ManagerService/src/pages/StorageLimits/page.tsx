import {  useState } from 'react';
import { Icon } from '@iconify/react';
import {useStorageStats} from '@/Hooks/useStorageStats';
import StorageFilters from "@/components/Admin/StorageLimits/StorageFilters.tsx";
import StorageOverviewCards from "@/components/Admin/StorageLimits/Card/StorageOverviewCards.tsx";
import WarehouseCapacityChart from "@/components/Admin/StorageLimits/Chart/WarehouseCapacityChart.tsx";
import StorageAlertsPanel from "@/components/Admin/StorageLimits/StorageAlertsPanel.tsx";
import StackCapacityTable from "@/components/Admin/StorageLimits/Table/StackCapacityTable.tsx";

const StorageLimitsPage = () => {
    const [timeFilter, setTimeFilter] = useState("today");
    const [warehouseFilter, setWarehouseFilter] = useState("");

    // Sử dụng API data thay vì stacks từ Redux
    const { data: storageData, loading } = useStorageStats(warehouseFilter, timeFilter);



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                            <Icon icon="mdi:warehouse" className="text-3xl text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Kiểm Tra Giới Hạn Lưu Trữ
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Theo dõi sức chứa và cảnh báo tồn kho trong kho hàng
                            </p>
                        </div>
                    </div>

                    <StorageFilters
                        timeFilter={timeFilter}
                        warehouseFilter={warehouseFilter}
                        onTimeFilterChange={setTimeFilter}
                        onWarehouseFilterChange={setWarehouseFilter}
                    />
                </div>

                {/* Overview Cards - Truyền API data */}
                <StorageOverviewCards
                    capacityData={storageData?.capacity}
                    loading={loading}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Warehouse Capacity Chart */}
                    <div className="lg:col-span-2">
                        <WarehouseCapacityChart
                            stackData={storageData?.stacks}
                            loading={loading}
                        />
                    </div>

                    {/* Storage Alerts */}
                    <div className="lg:col-span-1">
                        <StorageAlertsPanel
                            alerts={storageData?.alerts}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Stack Capacity Table */}
                <StackCapacityTable
                    stackData={storageData?.stacks}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default StorageLimitsPage;