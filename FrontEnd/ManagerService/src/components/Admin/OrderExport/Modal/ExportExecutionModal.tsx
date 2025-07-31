import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Progress,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import OrderExportSlice, {ExportOrder, ExportOrderItem} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetOrderItem} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import {ExportOrderItemSelector} from "@/pages/ExecuteExport/Store/Selector.tsx";

interface ExportExecutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedOrder: ExportOrder | null;
    isExecuting: boolean;
    executionProgress: number;
    onStartExecution: () => void;
}

export default function ExportExecutionModal({
                                                 isOpen,
                                                 onClose,
                                                 selectedOrder,
                                                 isExecuting,
                                                 executionProgress,
                                                 onStartExecution
                                             }: ExportExecutionModalProps) {
    if (!selectedOrder) return null;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const items=useSelector(ExportOrderItemSelector)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            dispatch(OrderExportSlice.actions.setOrderExportItemList([]));
            try {
                await (dispatch as any)(MiddleGetOrderItem(selectedOrder.exportOrderId));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedOrder]);
    return (
        <Modal size="4xl" isOpen={isOpen} onClose={onClose} isDismissable={!isExecuting}>
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Icon icon="mdi:package-up" className="text-2xl text-orange-600" />
                    <div>
                        <h3 className="text-xl font-semibold">Thực Hiện Xuất Hàng</h3>
                        <p className="text-sm text-gray-500">
                            Mã đơn: #{selectedOrder?.exportOrderId.slice(-8)}
                        </p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Khách hàng:</p>
                                    <p className="font-medium">{selectedOrder.customer?.supplierName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng giá trị:</p>
                                    <p className="font-semibold text-lg text-orange-600">
                                        {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                                    </p>
                                </div>
                            </div>

                            {isExecuting && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Tiến độ xuất hàng:</span>
                                        <span className="text-sm text-gray-600">{executionProgress}%</span>
                                    </div>
                                    <Progress
                                        value={executionProgress}
                                        color="warning"
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableColumn>Sản phẩm</TableColumn>
                                    <TableColumn>Số lượng</TableColumn>
                                    <TableColumn>Vị trí</TableColumn>
                                    <TableColumn>Số lô</TableColumn>
                                </TableHeader>
                                <TableBody  emptyContent="Không có yêu cầu nào"
                                            isLoading={loading}
                                            loadingContent={<Spinner label="Loading..." />}>
                                    {items?.map((item:ExportOrderItem) => (
                                        <TableRow key={item.itemId}>
                                            <TableCell>{item.product?.productName}</TableCell>
                                            <TableCell>
                                                <Chip size="sm" variant="flat">
                                                    {item.quantity}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>{item.bin?.binCode || "N/A"}</TableCell>
                                            <TableCell>{item.batchNumber || "N/A"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose} isDisabled={isExecuting}>
                        Đóng
                    </Button>
                    <Button
                        color="success"
                        onPress={onStartExecution}
                        isDisabled={isExecuting}
                        startContent={<Icon icon="mdi:truck" />}
                    >
                        {isExecuting ? "Đang xuất..." : "Bắt đầu xuất hàng"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}