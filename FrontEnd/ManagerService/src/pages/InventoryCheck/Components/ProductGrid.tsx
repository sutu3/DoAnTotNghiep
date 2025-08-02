import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import {InventoryProduct} from "@/Store/InventoryWarehouseSlice.tsx";

interface ProductGridProps {
    inventoryData: InventoryProduct[];
    onProductSelect: (product: InventoryProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ inventoryData, onProductSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {inventoryData.map((product) => (
                <Card
                    key={product.inventoryProductId}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
                    isPressable
                    onPress={() => onProductSelect(product)}
                >
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <Icon icon="mdi:package" className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                    {product?.productDetails?.productName}
                                </p>
                                {/*<div className="flex items-center gap-2 mt-1">*/}
                                {/*    <Chip size="sm" variant="flat" color="primary" className="text-xs">*/}
                                {/*        {product?.binDetails?.binCode}*/}
                                {/*    </Chip>*/}
                                {/*</div>*/}
                                {/*<p className="text-xs text-blue-600 font-medium mt-1">*/}
                                {/*    SL: {product.quantity}*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default ProductGrid;