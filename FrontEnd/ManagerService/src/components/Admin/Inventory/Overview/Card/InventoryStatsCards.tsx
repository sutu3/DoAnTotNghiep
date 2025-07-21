import { Package, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import {
    InventoryStatsSelector,
    InventoryLoadingSelector,
    ExpiringProductsSelector, LowStockProductsSelector, RecentMovementsSelector
} from "@/Store/Selector.tsx";
import {InventoryStats, LowStockProduct} from "@/Store/InventoryOverView.tsx";

const InventoryStatsCards = () => {

    // Sử dụng data từ InventorySlice thay vì local state
    const stats:InventoryStats = useSelector(InventoryStatsSelector);
    const lowStockProducts:LowStockProduct[] = useSelector(LowStockProductsSelector);
    const expiringProduct=useSelector(ExpiringProductsSelector);
    const recentMovements=useSelector(RecentMovementsSelector);
    const loading = useSelector(InventoryLoadingSelector);

    const statCards = [
        {
            title: "Total Products",
            value: lowStockProducts?.length,
            icon: <Package className="w-6 h-6" />,
            color: "bg-blue-500",
            loading: loading.stats
        },
        {
            title: "Low Stock Items",
            value: lowStockProducts?.length,
            icon: <AlertTriangle className="w-6 h-6" />,
            color: "bg-yellow-500",
            loading: loading.lowStock
        },
        {
            title: "Expiring Soon",
            value: expiringProduct?.length,
            icon: <Calendar className="w-6 h-6" />,
            color: "bg-orange-500",
            loading: loading.expiring
        },
        {
            title: "Recent Movements",
            value: recentMovements?.length,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-green-500",
            loading: loading.movements
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.title}
                            </p>
                            {stat.loading ? (
                                <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mt-2"></div>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                            )}
                        </div>
                        <div className={`${stat.color} p-3 rounded-full text-white`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InventoryStatsCards;