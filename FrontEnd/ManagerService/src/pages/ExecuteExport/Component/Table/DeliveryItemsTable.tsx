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
    Spinner,
    Avatar,
    Badge
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeliveryItemModal from "../Modal/DeliveryItemModal.tsx";
import { MiddleGetOrderItem } from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import { ExportOrder, ExportOrderItem } from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {ExportOrderItemSelector} from "@/pages/ExecuteExport/Store/Selector.tsx";

interface DeliveryItemsTableProps {
    exportOrderId: string;
    exportOrder: ExportOrder | undefined;
}

export default function DeliveryItemsTable({ exportOrderId, exportOrder }: DeliveryItemsTableProps) {
    const dispatch = useDispatch();
    const exportItems: ExportOrderItem[] = useSelector(ExportOrderItemSelector);
    const [selectedItem, setSelectedItem] = useState<ExportOrderItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (exportOrderId) {
            setLoading(true);
            (dispatch as any)(MiddleGetOrderItem(exportOrderId))
                .finally(() => setLoading(false));
        }
    }, [exportOrderId, dispatch]);

    const handleAddToDelivery = (item: ExportOrderItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header phiếu xuất - Compact version */}
            <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-600 rounded-lg p-2">
                                    <Icon icon="mdi:clipboard-list" className="text-lg text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Đơn Xuất Hàng</h2>
                                    <p className="text-sm text-gray-600">
                                        #{exportOrder?.exportOrderId?.slice(-8) || 'XXXXXXXX'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Ngày tạo</p>
                                    <p className="text-sm font-semibold">
                                        {exportOrder?.requestDate ?
                                            new Date(exportOrder.requestDate).toLocaleDateString('vi-VN') :
                                            new Date().toLocaleDateString('vi-VN')
                                        }
                                    </p>
                                </div>
                                <Chip
                                    color="success"
                                    variant="flat"
                                    startContent={<Icon icon="mdi:check-circle" className="text-xs" />}
                                >
                                    Đã duyệt
                                </Chip>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Thông tin tóm tắt - Horizontal layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Thông tin kho - Compact */}
                <Card className="border-l-2 border-l-blue-500">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <Icon icon="mdi:warehouse" className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Kho xuất</p>
                                <p className="font-semibold text-sm">{exportOrder?.warehouse?.warehouseName || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{exportOrder?.warehouse?.district}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Thông tin khách hàng - Compact */}
                <Card className="border-l-2 border-l-green-500">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Icon icon="mdi:account-group" className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Khách hàng</p>
                                <p className="font-semibold text-sm">{exportOrder?.customer?.supplierName || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{exportOrder?.customer?.phoneNumber}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Thông tin người tạo - Compact */}
                <Card className="border-l-2 border-l-purple-500">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={exportOrder?.createByUser?.urlImage}
                                name={exportOrder?.createByUser?.fullName}
                                size="sm"
                                className="bg-purple-100"
                            />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Người tạo</p>
                                <p className="font-semibold text-sm">{exportOrder?.createByUser?.fullName?exportOrder?.createByUser?.email: 'N/A'}</p>
                                <p className="text-xs text-gray-500">{exportOrder?.createByUser?.userName}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Danh sách sản phẩm - Enhanced table */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-600 rounded-lg p-2">
                                <Icon icon="mdi:package-variant" className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Sản Phẩm Cần Xuất</h3>
                                <p className="text-sm text-gray-600">{exportItems.length} sản phẩm</p>
                            </div>
                        </div>
                        <Badge content={exportItems.length} color="primary" variant="flat">
                            <Icon icon="mdi:format-list-bulleted" className="text-xl text-gray-600" />
                        </Badge>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    <Table
                        removeWrapper
                        aria-label="Export items table"
                        classNames={{
                            table: "min-h-[300px]",
                            th: "bg-gray-50 text-gray-700 font-semibold",
                            td: "py-3"
                        }}
                    >
                        <TableHeader>
                            <TableColumn width="180">SẢN PHẨM</TableColumn>
                            <TableColumn width="50">SỐ LƯỢNG</TableColumn>
                            <TableColumn width="100">ĐƠN VỊ</TableColumn>
                            <TableColumn width="120">ĐƠN GIÁ</TableColumn>
                            <TableColumn width="120">VỊ TRÍ</TableColumn>
                            <TableColumn width="100">THAO TÁC</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={
                                <div className="text-center py-8">
                                    <Icon icon="mdi:package-variant-closed" className="text-4xl text-gray-300 mb-2" />
                                    <p className="text-gray-500">Chưa có sản phẩm nào</p>
                                </div>
                            }
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải sản phẩm..." />}
                        >
                            {exportItems.map((item, index) => (
                                <TableRow key={index} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Icon icon="mdi:cube-outline" className="text-white text-lg" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{item.product?.productName}</p>
                                                <p className="text-xs text-gray-500">SKU: {item.product?.sku}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            startContent={<Icon icon="mdi:package" className="text-xs" />}
                                        >
                                            {item.quantity}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">{item.unit?.unitName}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-semibold text-green-600">
                                            {item.unitPrice?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="secondary"
                                            startContent={<Icon icon="mdi:map-marker" className="text-xs" />}
                                        >
                                            {item.bin?.binCode || 'N/A'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            onPress={() => handleAddToDelivery(item)}
                                            startContent={<Icon icon="mdi:plus" className="text-xs" />}
                                            className="min-w-0 px-3"
                                        >
                                            Thêm
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <DeliveryItemModal
                exportOrder={exportOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exportItem={selectedItem}
            />
        </div>
    );
}