import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import {InventoryLoadingSelector, RecentMovementsSelector} from "@/Store/Selector.tsx";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal} from "react";
import {RecentMovement} from "@/Store/InventoryOverView.tsx";


const RecentMovements = () => {
    const movements:RecentMovement[] = useSelector(RecentMovementsSelector);
    const loading = useSelector(InventoryLoadingSelector);

    if (loading.movements) {
        return <div>Loading...</div>;
    }


    const getMovementIcon = (type: any) => {
        switch (type) {
            case "IMPORT":
                return <ArrowUp className="w-4 h-4 text-green-500"/>;
            case "EXPORT":
                return <ArrowDown className="w-4 h-4 text-red-500"/>;
            default:
                return <RotateCcw className="w-4 h-4 text-blue-500"/>;
        }
    };

    const getMovementColor = (type: string) => {
        switch (type) {
            case "IMPORT":
                return "text-green-600";
            case "EXPORT":
                return "text-red-600";
            default:
                return "text-blue-600";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Stock Movements
            </h3>

            <div className="space-y-4">
                {movements.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-600 rounded-full">
                                {getMovementIcon(movement.movementType)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {movement.productDetails.productName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    by {movement.performedByUser.userName} • {movement?.createdAt}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-medium ${getMovementColor(movement.movementType)}`}>
                                {movement.movementType === "EXPORT" ? "-" : "+"}{movement.quantity}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                                {movement.movementType}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMovements;