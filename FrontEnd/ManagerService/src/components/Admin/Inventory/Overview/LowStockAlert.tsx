import { AlertTriangle, Package } from "lucide-react";
import { useSelector } from "react-redux";
import {InventoryLoadingSelector, LowStockProductsSelector} from "@/Store/Selector.tsx";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal} from "react";
import {LowStockProduct} from "@/Store/InventoryOverView.tsx";

const LowStockAlert = () => {
    const lowStockProducts:LowStockProduct[] = useSelector(LowStockProductsSelector);
    const loading = useSelector(InventoryLoadingSelector);

    if (loading.lowStock) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2"/>
                    Low Stock Alert
                </h3>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {lowStockProducts.length} items
                </span>
            </div>

            <div className="space-y-3">
                {lowStockProducts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.productDetails.productName}</p>
                                <p className="text-sm text-gray-500">Current: {item.totalQuantity}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-red-600">
                                Min: {item.minStockLevel}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LowStockAlert;