// src/components/Admin/OrderExport/Modal/ExportOrderDetailModal.tsx
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import OrderExportSlice, {ExportOrder, ExportOrderItem} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetOrderItem} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import {ExportOrderItemSelector} from "@/pages/ExecuteExport/Store/Selector.tsx";

interface ExportOrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: ExportOrder | null;
    onApprove: (orderId: string) => void;
    onReject: (order: ExportOrder) => void;
}

export default function ExportOrderDetailModal({
                                                   isOpen,
                                                   onClose,
                                                   order,
                                                   onApprove,
                                                   onReject
                                               }: ExportOrderDetailModalProps) {
    if (!order) return null;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleApprove = () => {
        onApprove(order.exportOrderId);
        onClose();
    };
    const items=useSelector(ExportOrderItemSelector)
    const handleReject = () => {
        onReject(order);
        onClose();
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            dispatch(OrderExportSlice.actions.setOrderExportItemList([]));
            try {
                await (dispatch as any)(MiddleGetOrderItem(order.exportOrderId));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [order]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:package-variant" className="text-2xl text-blue-600" />
                        <div>
                            <h2 className="text-xl font-bold">Chi Tiết Đơn Xuất Hàng</h2>
                            <p className="text-sm text-gray-500">#{order.exportOrderId.slice(-8)}</p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-6">
                        {/* Order Information */}
                        <Card>
                            <CardBody className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon icon="mdi:information" />
                                    Thông Tin Đơn Hàng
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Người tạo</p>
                                        <p className="font-medium">{order.createByUser?.userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Khách hàng</p>
                                        <p className="font-medium">{order?.customer?.supplierName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày tạo</p>
                                        <p className="font-medium">
                                            {new Date(order.requestDate).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày giao hàng</p>
                                        <p className="font-medium">
                                            {order.deliveryDate ?
                                                new Date(order.deliveryDate).toLocaleDateString('vi-VN') :
                                                'Chưa xác định'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        <Chip
                                            color={order.status === "CREATED" ? "warning" : "success"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {order.status === "CREATED" ? "Chờ duyệt" : order.status}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng giá trị</p>
                                        <p className="font-semibold text-green-600 text-lg">
                                            {order.totalAmount?.toLocaleString('vi-VN')} ₫
                                        </p>
                                    </div>
                                </div>

                                {order.description && (
                                    <div>
                                        <p className="text-sm text-gray-500">Mô tả</p>
                                        <p className="font-medium">{order.description}</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Items List */}
                        <Card>
                            <CardBody>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                    <Icon icon="mdi:package-variant-closed" />
                                    Danh Sách Sản Phẩm ({order.items?.length || 0})
                                </h3>

                                <Table aria-label="Export items table">
                                    <TableHeader>
                                        <TableColumn>SẢN PHẨM</TableColumn>
                                        <TableColumn>SỐ LƯỢNG</TableColumn>
                                        <TableColumn>ĐƠN GIÁ</TableColumn>
                                        <TableColumn>THÀNH TIỀN</TableColumn>
                                        <TableColumn>VỊ TRÍ BIN</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="Không có yêu cầu nào"
                                               isLoading={loading}
                                               loadingContent={<Spinner label="Loading..." />}>
                                        {items?.map((item:ExportOrderItem, index:number) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{item.product?.productName}</p>
                                                        <p className="text-sm text-gray-500">{item.unit?.unitName}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="sm" variant="flat" color="primary">
                                                        {item.quantity}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    {item.unitPrice?.toLocaleString('vi-VN')} ₫
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-green-600">
                                                        {(item.quantity * item.unitPrice)?.toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="sm" variant="flat">
                                                        {item.bin?.binCode || 'Chưa chọn'}
                                                    </Chip>
                                                </TableCell>
                                            </TableRow>
                                        )) || []}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Đóng
                    </Button>
                    {order.status === "PENDING_APPROVAL" && (
                        <>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleReject}
                                startContent={<Icon icon="mdi:close" />}
                            >
                                Từ chối
                            </Button>
                            <Button
                                color="success"
                                onPress={handleApprove}
                                startContent={<Icon icon="mdi:check" />}
                            >
                                Duyệt đơn
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
