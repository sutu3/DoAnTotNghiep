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

    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface ImportOrder {
    importOrderId: string;
    description: string;
    status: "Created" | "InProgress" | "Confirmed" | "Completed" | "Cancel";
    requestDate: string;
    totalAmount: number;
    items: ImportItem[];
}

interface ImportItem {
    itemId: string;
    productName: string;
    supplierName: string;
    requestQuantity: number;
    realityQuantity?: number;
    unitPrice: number;
    binLocation?: string;
    batchNumber?: string;
    expiryDate?: string;
}

export default function ExecuteImportPage() {
    const [importOrders, setImportOrders] = useState<ImportOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
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

    // Sample data - tương tự như pattern trong
    useEffect(() => {
        const sampleOrders: ImportOrder[] = [
            {
                importOrderId: "imp-order-001-uuid-string",
                description: "Nhập hàng laptop Dell tháng 1/2024",
                status: "Confirmed",
                requestDate: "2024-01-20T08:00:00Z",
                totalAmount: 150000000,
                items: [
                    {
                        itemId: "item-001",
                        productName: "Laptop Dell Inspiron 15",
                        supplierName: "Công ty TNHH Dell Việt Nam",
                        requestQuantity: 10,
                        realityQuantity: 0,
                        unitPrice: 15000000,
                        binLocation: "A-001-BIN-1",
                        batchNumber: "BATCH-2024-001"
                    }
                ]
            },
            {
                importOrderId: "imp-order-002-uuid-string",
                description: "Nhập phụ kiện máy tính",
                status: "InProgress",
                requestDate: "2024-01-21T10:00:00Z",
                totalAmount: 25000000,
                items: [
                    {
                        itemId: "item-002",
                        productName: "Chuột không dây Logitech",
                        supplierName: "Logitech Việt Nam",
                        requestQuantity: 50,
                        realityQuantity: 45,
                        unitPrice: 250000
                    }
                ]
            }
        ];
        setImportOrders(sampleOrders);
    }, []);

    const handleExecuteImport = (order: ImportOrder) => {
        setSelectedOrder(order);
        setExecutionProgress(0);
        setIsExecuting(false);
        onOpen();
    };

    const handleStartExecution = async () => {
        if (!selectedOrder) return;

        setIsExecuting(true);
        setExecutionProgress(0);

        // Simulate import execution process
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setExecutionProgress(i);
        }

        // Update order status
        setImportOrders(prev =>
            prev.map(order =>
                order.importOrderId === selectedOrder.importOrderId
                    ? { ...order, status: "Completed" as const }
                    : order
            )
        );

        setIsExecuting(false);
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const handleUpdateRealityQuantity = (itemId: string, quantity: number) => {
        if (!selectedOrder) return;

        const updatedOrder = {
            ...selectedOrder,
            items: selectedOrder.items.map(item =>
                item.itemId === itemId
                    ? { ...item, realityQuantity: quantity }
                    : item
            )
        };
        setSelectedOrder(updatedOrder);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - tương tự pattern trong  */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-down" className="text-3xl text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Thực Hiện Nhập Hàng
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Xử lý và thực hiện các đơn nhập hàng đã được phê duyệt
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:clock-outline" className="text-2xl text-warning mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Chờ xử lý</p>
                            <p className="text-2xl font-bold text-warning">
                                {importOrders.filter(o => o.status === "Confirmed").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:progress-clock" className="text-2xl text-primary mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Đang thực hiện</p>
                            <p className="text-2xl font-bold text-primary">
                                {importOrders.filter(o => o.status === "InProgress").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:check-circle" className="text-2xl text-success mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Hoàn thành</p>
                            <p className="text-2xl font-bold text-success">
                                {importOrders.filter(o => o.status === "Completed").length}
                            </p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <Icon icon="mdi:currency-usd" className="text-2xl text-purple-600 mb-2 mx-auto" />
                            <p className="text-sm text-gray-600">Tổng giá trị</p>
                            <p className="text-lg font-bold text-purple-600">
                                {importOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('vi-VN')} ₫
                            </p>
                        </CardBody>
                    </Card>
                </div>

                {/* Import Orders Table */}
                <Card className="shadow-xl">
                    <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                Đơn Nhập Hàng Cần Xử Lý
                            </h2>
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<Icon icon="mdi:refresh" />}
                                size="sm"
                            >
                                Làm mới
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <TableHeader>
                                <TableColumn>Mã đơn</TableColumn>
                                <TableColumn>Mô tả</TableColumn>
                                <TableColumn>Ngày tạo</TableColumn>
                                <TableColumn>Số items</TableColumn>
                                <TableColumn>Tổng tiền</TableColumn>
                                <TableColumn>Trạng thái</TableColumn>
                                <TableColumn>Thao tác</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {importOrders.map((order) => (
                                    <TableRow key={order.importOrderId}>
                                        <TableCell className="font-mono text-sm">
                                            #{order.importOrderId.slice(-8)}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {order.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(order.requestDate).toLocaleTimeString('vi-VN')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" color="default">
                                                {order.items.length} items
                                            </Chip>
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
                                                    onClick={() => handleExecuteImport(order)}
                                                    startContent={<Icon icon="mdi:eye" />}
                                                >
                                                    Xem
                                                </Button>
                                                {(order.status === "Confirmed" || order.status === "InProgress") && (
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        onClick={() => handleExecuteImport(order)}
                                                        startContent={<Icon icon="mdi:play" />}
                                                    >
                                                        Thực hiện
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

                {/*/!* Import Execution Modal - tương tự pattern trong  *!/*/}
                {/*<Modal size="4xl" isOpen={isOpen} onClose={onClose} isDismissable={!isExecuting}>*/}
                {/*    <ModalContent>*/}
                {/*        <ModalHeader className="flex items-center gap-3">*/}
                {/*            <Icon icon="mdi:package-down" className="text-2xl text-green-600" />*/}
                {/*            <div>*/}
                {/*                <h3 className="text-xl font-semibold">Thực Hiện Nhập Hàng</h3>*/}
                {/*                <p className="text-sm text-gray-500">*/}
                {/*                    Mã đơn: #{selectedOrder?.importOrderId.slice(-8)}*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </ModalHeader>*/}
                {/*        <ModalBody>*/}
                {/*            {selectedOrder && (*/}
                {/*                <div className="space-y-6">*/}
                {/*                    /!* Order Info *!/*/}
                {/*                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">*/}
                {/*                        <div>*/}
                {/*                            <p className="text-sm text-gray-600 dark:text-gray-400">Mô tả:</p>*/}
                {/*                            <p className="font-medium">{selectedOrder.description}</p>*/}
                {/*                        </div>*/}
                {/*                        <div>*/}
                {/*                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng giá trị:</p>*/}
                {/*                            <p className="font-semibold text-lg text-green-600">*/}
                {/*                                {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}

                {/*                    /!* Execution Progress *!/*/}
                {/*                    {isExecuting && (*/}
                {/*                        <div className="space-y-3">*/}
                {/*                            <div className="flex justify-between items-center">*/}
                {/*                                <span className="text-sm font-medium">Tiến độ thực hiện:</span>*/}
                {/*                                <span className="text-sm text-gray-600">{executionProgress}%</span>*/}
                {/*                            </div>*/}
                {/*                            <Progress*/}
                {/*                                value={executionProgress}*/}
                {/*                                color="success"*/}
                {/*                                className="w-full"*/}
                {/*                            />*/}
                {/*                        </div>*/}
                {/*                    )}*/}

                {/*                    <Divider />*/}

                {/*                    /!* Items List *!/*/}
                {/*                    <div>*/}
                {/*                        <h*/}
            </div>
        </div>
);
}