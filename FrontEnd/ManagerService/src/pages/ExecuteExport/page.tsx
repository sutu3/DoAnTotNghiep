"use client";

import  { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Progress,
    Select,
    SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface ExportOrder {
    exportOrderId: string;
    description: string;
    status: "Created" | "InProgress" | "Confirmed" | "Completed" | "Cancel";
    requestDate: string;
    deliveryDate?: string;
    totalAmount: number;
    customer?: string;
    items: ExportItem[];
}

interface ExportItem {
    itemId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    binLocation?: string;
    batchNumber?: string;
}

export default function ExecuteExportPage() {
    const [exportOrders, setExportOrders] = useState<ExportOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ExportOrder | null>(null);
    const [executionProgress, setExecutionProgress] = useState(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const statusColorMap = {
        Created: "default",
        InProgress: "primary",
        Confirmed: "warning",
        Completed: "success",
        Cancel: "danger"
    };

    useEffect(() => {
        const sampleOrders: ExportOrder[] = [
            {
                exportOrderId: "exp-order-001-uuid-string",
                description: "Xuất hàng cho khách hàng ABC",
                status: "Confirmed",
                requestDate: "2024-01-22T08:00:00Z",
                deliveryDate: "2024-01-25T14:00:00Z",
                totalAmount: 75000000,
                customer: "Công ty ABC",
                items: [
                    {
                        itemId: "exp-item-001",
                        productName: "Laptop Dell Inspiron 15",
                        quantity: 5,
                        unitPrice: 15000000,
                        binLocation: "A-001-BIN-1",
                        batchNumber: "BATCH-2024-001"
                    }
                ]
            }
        ];
        setExportOrders(sampleOrders);
    }, []);

    const handleExecuteExport = (order: ExportOrder) => {
        setSelectedOrder(order);
        setExecutionProgress(0);
        setIsExecuting(false);
        onOpen();
    };

    const handleStartExecution = async () => {
        if (!selectedOrder) return;

        setIsExecuting(true);
        setExecutionProgress(0);

        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setExecutionProgress(i);
        }

        setExportOrders(prev =>
            prev.map(order =>
                order.exportOrderId === selectedOrder.exportOrderId
                    ? { ...order, status: "Completed" as const }
                    : order
            )
        );

        setIsExecuting(false);
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-up" className="text-3xl text-orange-600" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Thực Hiện Xuất Hàng
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Xử lý và thực hiện các đơn xuất hàng đã được phê duyệt
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:clock-outline" className="text-2xl text-warning mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Chờ xuất</p>
                            <p className="text-2xl font-bold text-warning">
                                {exportOrders.filter(o => o.status === "Confirmed").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:truck-delivery" className="text-2xl text-blue-600 mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Đang giao</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {exportOrders.filter(o => o.status === "InProgress").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:check-circle" className="text-2xl text-success mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Hoàn thành</p>
                            <p className="text-2xl font-bold text-success">
                                {exportOrders.filter(o => o.status === "Completed").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:calendar-today" className="text-2xl text-purple-600 mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Hôm nay</p>
                            <p className="text-2xl font-bold text-purple-600">3</p>
                        </CardBody>
                    </Card>
                </div>

                {/* Export Orders Table */}
                <Card className="shadow-xl">
                    <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                Đơn Xuất Hàng Cần Xử Lý
                            </h2>
                            <div className="flex gap-3">
                                <Select size="sm" placeholder="Lọc theo trạng thái" className="w-48">
                                    <SelectItem key="all">Tất cả</SelectItem>
                                    <SelectItem key="confirmed">Đã phê duyệt</SelectItem>
                                    <SelectItem key="inprogress">Đang thực hiện</SelectItem>
                                </Select>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    startContent={<Icon icon="mdi:refresh" />}
                                    size="sm"
                                >
                                    Làm mới
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <TableHeader>
                                <TableColumn>Mã đơn</TableColumn>
                                <TableColumn>Khách hàng</TableColumn>
                                <TableColumn>Ngày xuất</TableColumn>
                                <TableColumn>Ngày giao</TableColumn>
                                <TableColumn>Tổng tiền</TableColumn>
                                <TableColumn>Trạng thái</TableColumn>
                                <TableColumn>Thao tác</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {exportOrders.map((order) => (
                                    <TableRow key={order.exportOrderId}>
                                        <TableCell className="font-mono text-sm">
                                            #{order.exportOrderId.slice(-8)}
                                        </TableCell>
                                        <TableCell>{order.customer || "N/A"}</TableCell>
                                        <TableCell>
                                            {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('vi-VN') : "Chưa xác định"}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">
                                                {order.totalAmount.toLocaleString('vi-VN')} ₫
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={statusColorMap[order.status]}
                                                variant="flat"
                                            >
                                                {order.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    variant="light"
                                                    onClick={() => handleExecuteExport(order)}
                                                    startContent={<Icon icon="mdi:eye" />}
                                                >
                                                    Xem
                                                </Button>
                                                {order.status === "Confirmed" && (
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        onClick={() => handleExecuteExport(order)}
                                                        startContent={<Icon icon="mdi:truck" />}
                                                    >
                                                        Xuất hàng
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                {/* Export Execution Modal */}
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
                                            <p className="font-medium">{selectedOrder.customer || "N/A"}</p>
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
                                        <TableBody>
                                            {selectedOrder.items.map((item) => (
                                                <TableRow key={item.itemId}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell>
                                                        <Chip size="sm" variant="flat">
                                                            {item.quantity}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>{item.binLocation || "N/A"}</TableCell>
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
                                onPress={handleStartExecution}
                                isDisabled={isExecuting}
                                startContent={<Icon icon="mdi:truck" />}
                            >
                                {isExecuting ? "Đang xuất..." : "Bắt đầu xuất hàng"}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}