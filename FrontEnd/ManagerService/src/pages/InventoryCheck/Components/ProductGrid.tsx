import React from 'react';
import { Card, CardBody, Chip, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import {InventoryProduct} from "@/Store/InventoryWarehouseSlice.tsx";

interface ProductGridProps {
    inventoryData: InventoryProduct[];
    onProductSelect: (product: InventoryProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ inventoryData, onProductSelect }) => {
    const getStockStatusColor = (current: number, min: number, max: number) => {
        const percentage = (current / max) * 100;
        if (current <= min) return 'danger';
        if (percentage <= 30) return 'warning';
        return 'success';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {inventoryData.map((product) => {
                const stockPercentage = Math.min((product.totalQuantity / product.maxStockLevel) * 100, 100);
                const isLowStock = product.totalQuantity <= product.minStockLevel;

                return (
                    <Card
                        key={product.inventoryProductId}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
                        isPressable
                        onPress={() => onProductSelect(product)}
                    >
                        <CardBody className="p-4">
                            <div className="space-y-3">
                                {/* Header với hình ảnh và tên sản phẩm */}
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                        {product?.productDetails?.urlImageProduct ? (
                                            <img
                                                src={product.productDetails.urlImageProduct}
                                                alt={product.productDetails.productName}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <Icon icon="mdi:package-variant" className="text-white text-2xl" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                            {product?.productDetails?.productName}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Chip size="sm" variant="flat" color="default" className="text-xs">
                                                {product?.productDetails?.sku}
                                            </Chip>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={product.status === 'ACTIVE' ? 'success' : 'default'}
                                                className="text-xs"
                                            >
                                                {product.status}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin giá và đơn vị */}
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-600">Giá bán:</span>
                                        <span className="font-semibold text-green-600 text-sm">
                                            {formatPrice(product?.productDetails?.price || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Đơn vị:</span>
                                        <span className="text-xs font-medium">
                                            {product?.productDetails?.unit?.unitName}
                                        </span>
                                    </div>
                                </div>

                                {/* Thông tin tồn kho */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Tồn kho:</span>
                                        <div className="flex items-center gap-1">
                                            <span className={`font-bold text-sm ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                                                {product.totalQuantity.toLocaleString()}
                                            </span>
                                            {isLowStock && (
                                                <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress bar tồn kho */}
                                    <Progress
                                        size="sm"
                                        value={stockPercentage}
                                        color={getStockStatusColor(product.totalQuantity, product.minStockLevel, product.maxStockLevel)}
                                        className="w-full"
                                    />

                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Min: {product.minStockLevel}</span>
                                        <span>Max: {product.maxStockLevel}</span>
                                    </div>
                                </div>

                                {/* Thông tin kho */}
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                    <Icon icon="mdi:warehouse" className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-600 truncate">
                                        {product?.warehouseDetails?.warehouseName}
                                    </span>
                                </div>

                                {/* Ngày cập nhật cuối */}
                                {product.updatedAt && (
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:clock-outline" className="text-gray-400 text-sm" />
                                        <span className="text-xs text-gray-500">
                                            Cập nhật: {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};
export default ProductGrid;
