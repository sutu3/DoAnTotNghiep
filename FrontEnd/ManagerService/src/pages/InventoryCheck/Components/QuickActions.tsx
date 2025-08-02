import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import {InventoryCheckItem} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";

interface QuickActionsProps {
    onReset: () => void;
    selectedProducts: InventoryCheckItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
                                                       onReset,
                                                       selectedProducts
                                                   }) => {
    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
                <h3 className="font-semibold text-gray-700">Thao Tác Nhanh</h3>
            </CardHeader>
            <CardBody className="space-y-3">
                <Button
                    variant="bordered"
                    startContent={<Icon icon="mdi:refresh" />}
                    className="w-full justify-start"
                    onClick={onReset}
                >
                    Làm mới
                </Button>
                <Button
                    variant="bordered"
                    startContent={<Icon icon="mdi:content-save" />}
                    className="w-full justify-start"
                    isDisabled={selectedProducts.length === 0}
                >
                    Lưu nháp
                </Button>
                <Button
                    variant="bordered"
                    startContent={<Icon icon="mdi:eye" />}
                    className="w-full justify-start"
                    isDisabled={selectedProducts.length === 0}
                >
                    Xem trước
                </Button>
            </CardBody>
        </Card>
    );
};

export default QuickActions;