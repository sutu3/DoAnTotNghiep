import React from 'react';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import {InventoryCheckItem} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";

interface CheckSheetSummaryProps {
    selectedProducts: InventoryCheckItem[];
    checkSheetNumber: string;
}

const CheckSheetSummary: React.FC<CheckSheetSummaryProps> = ({
                                                                 selectedProducts,
                                                                 checkSheetNumber
                                                             }) => {
    return (
        <Card className="shadow-lg border-0 bg-white sticky top-6">
            <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800">
                <div className="flex items-center gap-3">
                    <Icon icon="mdi:chart-box" className="text-xl text-gray-600" />
                    <div>
                        <h3 className="font-bold">Tóm Tắt</h3>
                        <p className="text-gray-500 text-sm">Thống kê phiếu kiểm kê</p>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:package-variant" className="text-blue-500" />
                            <span className="text-sm font-medium">Tổng sản phẩm</span>
                        </div>
                        <span className="font-bold text-blue-600">{selectedProducts.length}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:check-circle" className="text-green-500" />
                            <span className="text-sm font-medium">Khớp số lượng</span>
                        </div>
                        <span className="font-bold text-green-600">
                            {selectedProducts.filter(p => p.difference === 0).length}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:alert-circle" className="text-orange-500" />
                            <span className="text-sm font-medium">Có chênh lệch</span>
                        </div>
                        <span className="font-bold text-orange-600">
                            {selectedProducts.filter(p => p.difference !== 0).length}
                        </span>
                    </div>
                </div>

                <Divider />

                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Thông tin phiếu</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Số phiếu:</span>
                            <span className="font-mono font-medium">{checkSheetNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ngày tạo:</span>
                            <span>{new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Trạng thái:</span>
                            <Chip size="sm" color="warning" variant="flat">Nháp</Chip>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default CheckSheetSummary;