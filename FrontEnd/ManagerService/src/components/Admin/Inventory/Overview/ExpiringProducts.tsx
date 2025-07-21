import { Calendar, Package } from "lucide-react";
import { useSelector } from "react-redux";
import {ExpiringProductsSelector, InventoryLoadingSelector} from "@/Store/Selector.tsx";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";


const ExpiringProducts = () => {
    const expiringProducts = useSelector(ExpiringProductsSelector);
    const loading = useSelector(InventoryLoadingSelector);

    if (loading.expiring) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="w-5 h-5 text-orange-500 mr-2"/>
                    Expiring Products
                </h3>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {expiringProducts?.length||0} items
                </span>
            </div>

            <div className="space-y-3">
                {expiringProducts?.map((product: {
                    productName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
                    quantity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
                    expiryDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
                }, index: Key | null | undefined) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">{product.expiryDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpiringProducts;