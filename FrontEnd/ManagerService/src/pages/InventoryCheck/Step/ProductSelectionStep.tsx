import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import {InventoryProduct, InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";
import StockMovementAdjustmentModal from "@/components/Staff/InventoryCheck/Modal/StockMovementAdjustmentModal.tsx";
import ProductGrid from "@/pages/InventoryCheck/Components/ProductGrid.tsx";
import {AdjustmentData, InventoryCheckItem} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";

interface ProductSelectionStepProps {
    inventoryData: InventoryProduct[];
    selectedProducts: InventoryCheckItem[];
    onProductAdjustment: (adjustmentData: AdjustmentData, productId: string,inventoryWarehouse:InventoryWarehouse) => void;
    onNext: () => void;
    onPrev: () => void;
    canProceed: boolean;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
                                                                       inventoryData,
                                                                       selectedProducts,
                                                                       onProductAdjustment,
                                                                       onPrev,
                                                                   }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);

    const handleProductSelect = (product: InventoryProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (adjustmentData: AdjustmentData,inventoryWarehouse:InventoryWarehouse) => {
        console.log(selectedProduct);
        if (selectedProduct) {
            onProductAdjustment(adjustmentData, selectedProduct?.productDetails?.productId,inventoryWarehouse);
            setIsModalOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <Card className="shadow-lg border-0 bg-white ring-2 ring-green-500">
            <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-200 text-gray-800">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/40 rounded-lg flex items-center justify-center">
                            <Icon icon="mdi:package-variant" className="text-xl text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Chọn Sản Phẩm Kiểm Kê</h3>
                            <p className="text-emerald-600 text-sm">Thêm sản phẩm vào phiếu kiểm kê</p>
                        </div>
                    </div>
                    <Chip color="success" variant="flat" className="bg-white/40 text-emerald-600">
                        {selectedProducts.length} đã chọn
                    </Chip>
                </div>
            </CardHeader>
            <CardBody className="p-6">
                <ProductGrid
                    inventoryData={inventoryData}
                    onProductSelect={handleProductSelect}
                />

                <div className="flex justify-between mt-6">
                    <Button
                        variant="bordered"
                        onClick={onPrev}
                        startContent={<Icon icon="mdi:arrow-left" />}
                    >
                        Quay lại
                    </Button>
                </div>
            </CardBody>

            <StockMovementAdjustmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inventoryItem={selectedProduct}
                onSubmit={handleModalSubmit}
            />
        </Card>
    );
};

export default ProductSelectionStep;