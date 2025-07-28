"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Avatar,
    Divider
} from "@heroui/react";
import { FileText, Edit, Package, Calendar, User, MapPin } from "lucide-react";
import {ReceiptItemResponse, WarehouseReceiptResponse} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";
import {useDispatch} from "react-redux";
import {MiddleGetReceiptById} from "@/pages/ExecuteImport/Store/WarehousReceipteThunk.tsx";

interface ReceiptDetailComponentProps {
    receipt: WarehouseReceiptResponse;
    onEdit: () => void;
}

const ReceiptDetailComponent: React.FC<ReceiptDetailComponentProps> = ({
                                                                           receipt,
                                                                           onEdit
                                                                       }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (receipt?.receiptId) {
            loadReceiptDetails();
        }
    }, [receipt]);

    const loadReceiptDetails = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetReceiptById(receipt?.receiptId))
        } catch (error) {
            console.error("Error loading receipt details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'PARTIAL': return 'primary';
            case 'COMPLETED': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'PARTIAL': return 'Nhập một phần';
            case 'COMPLETED': return 'Hoàn thành';
            default: return status;
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card aria-labelledby="Input">
                <CardHeader aria-labelledby="Input">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Chi Tiết Phiếu Nhập Kho
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Mã phiếu: #{receipt.receiptId?.slice(-8)}
                                </p>
                            </div>
                        </div>
                        {receipt.status !== 'COMPLETED' && (
                            <Button
                                aria-labelledby="Input"
                                color="primary"
                                startContent={<Edit className="w-4 h-4" />}
                                onClick={onEdit}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Receipt Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card aria-labelledby="Input">
                    <CardHeader aria-labelledby="Input">
                        <h3 className="text-lg font-semibold text-gray-800">Thông Tin Phiếu</h3>
                    </CardHeader>
                    <CardBody aria-labelledby="Input" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Ngày tạo</p>
                                <p className="font-medium">
                                    {new Date(receipt.receivedDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Người tạo</p>
                                <p className="font-medium">{receipt.createdByUser}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Trạng thái</p>
                                <Chip
                                    color={getStatusColor(receipt.status)}
                                    variant="flat"
                                    size="sm"
                                >
                                    {getStatusText(receipt.status)}
                                </Chip>
                            </div>
                        </div>

                        {receipt.note && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                                    {receipt.note}
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card aria-labelledby="Input">
                    <CardHeader aria-labelledby="Input">
                        <h3 className="text-lg font-semibold text-gray-800">Đơn Hàng Liên Quan</h3>
                    </CardHeader>
                    <CardBody aria-labelledby="Input" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                <p className="font-mono font-medium">
                                    #{receipt.importOrderId?.slice(-8)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Kho nhập</p>
                                <p className="font-medium">
                                    {receipt.importOrder?.warehouse?.warehouseName || "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Receipt Items */}
            <Card aria-labelledby="Input">
                <CardHeader aria-labelledby="Input">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Danh Sách Sản Phẩm Đã Nhập
                    </h3>
                </CardHeader>
                <CardBody aria-labelledby="Input">
                    <Table aria-labelledby="Input">
                        <TableHeader aria-labelledby="Input">
                            <TableColumn aria-labelledby="Input">SẢN PHẨM</TableColumn>
                            <TableColumn aria-labelledby="Input">SL YÊU CẦU</TableColumn>
                            <TableColumn aria-labelledby="Input">SL THỰC NHẬN</TableColumn>
                            <TableColumn aria-labelledby="Input">VỊ TRÍ</TableColumn>
                            <TableColumn aria-labelledby="Input">GHI CHÚ</TableColumn>
                        </TableHeader>
                        <TableBody aria-labelledby="Input">
                            {receipt.receiptItems?.map((item: ReceiptItemResponse, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={item.importItem?.product?.urlImageProduct}
                                                size="sm"
                                                fallback={<Package className="w-4 h-4" />}
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    {item.importItem?.product?.productName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.importItem?.unit?.unitName}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-blue-600">
                                            {item?.importItem?.requestQuantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-green-600">
                                            {item.receivedQuantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {item.binDetails?.binCode || "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">
                                            {item.note || "-"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Summary */}
                    <Divider className="my-4" />
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-800">Tổng số lượng đã nhập:</span>
                        <span className="text-xl font-bold text-green-600">
                            {receipt.receiptItems?.reduce((total: number, item: any) =>
                                total + item.receivedQuantity, 0) || 0} sản phẩm
                        </span>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ReceiptDetailComponent;