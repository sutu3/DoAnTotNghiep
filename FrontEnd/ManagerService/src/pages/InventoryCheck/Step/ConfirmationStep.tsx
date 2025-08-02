import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import {AdjustmentData, InventoryCheckItem} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";
import CheckSheetTable from "@/pages/InventoryCheck/Step/CheckSheetTable.tsx";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";

interface ConfirmationStepProps {
    selectedProducts: InventoryCheckItem[];
    setSelectedProducts: React.Dispatch<React.SetStateAction<InventoryCheckItem[]>>;
    onPrev: () => void;
    onSubmit: () => void;
    onProductAdjustment: (adjustmentData: AdjustmentData, productId: string,inventoryWarehouse:InventoryWarehouse) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
                                                               selectedProducts,
                                                               setSelectedProducts,
                                                               onSubmit,
                                                               onProductAdjustment
                                                           }) => {
    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.filter(p => p.inventoryWarehouseId !== productId)
        );
    };

    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-purple-50 border-b border-gray-200">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Icon icon="mdi:check-circle" className="text-xl text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Xác Nhận & Tạo Phiếu</h3>
                            <p className="text-gray-600 text-sm">Kiểm tra lại thông tin và tạo phiếu kiểm kê</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            color="success"
                            startContent={<Icon icon="mdi:check-circle" />}
                            onClick={onSubmit}
                            isDisabled={selectedProducts.length === 0}
                        >
                            Tạo Phiếu Kiểm Kê
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                <CheckSheetTable
                    selectedProducts={selectedProducts}
                    onRemoveProduct={handleRemoveProduct}
                    onProductAdjustment={onProductAdjustment}
                />
            </CardBody>
        </Card>
    );
};

export default ConfirmationStep;