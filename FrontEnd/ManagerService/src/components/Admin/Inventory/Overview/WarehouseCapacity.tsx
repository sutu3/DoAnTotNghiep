import { Warehouse, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { WarehouseCapacitySelector, InventoryLoadingSelector } from "@/Store/Selector.tsx";

const WarehouseCapacity = () => {
    const warehouseCapacity = useSelector(WarehouseCapacitySelector);
    const loading = useSelector(InventoryLoadingSelector);

    // Tính toán utilization rate
    const utilizationRate = warehouseCapacity?.totalBins > 0
        ? Math.round((warehouseCapacity.occupiedBins / warehouseCapacity?.totalBins) * 100)
        : 0;

    const getCapacityColor = (rate: number) => {
        if (rate >= 90) return "text-red-600";
        if (rate >= 75) return "text-yellow-600";
        return "text-green-600";
    };

    if (loading.capacity) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Warehouse className="w-5 h-5 text-blue-500 mr-2" />
                    Warehouse Capacity
                </h3>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - utilizationRate / 100)}`}
                            className={getCapacityColor(utilizationRate)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getCapacityColor(utilizationRate)}`}>
                            {utilizationRate}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Bins</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {warehouseCapacity?.totalBins}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Occupied Bins</span>
                    <span className="font-medium text-orange-600">
                        {warehouseCapacity?.occupiedBins}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available Bins</span>
                    <span className="font-medium text-green-600">
                        {warehouseCapacity?.availableBins}
                    </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Utilization: {utilizationRate}% capacity used</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseCapacity;