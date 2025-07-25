// components/Export/ExportOrdersTable.tsx
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
    Chip, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ExportOrder } from "@/Store/ExportOrderSlice.tsx";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";

interface ExportOrdersTableProps {
    warehouse:string;
    setWarehouse:(warehouse:string) => void;
    exportOrders: ExportOrder[];
    onExecuteExport: (order: ExportOrder) => void;
    onRefresh: () => void;
    loading: boolean;
}

export default function ExportOrdersTable({warehouse,setWarehouse,
                                              exportOrders,
                                              onExecuteExport,
                                              onRefresh,loading
                                          }: ExportOrdersTableProps) {
    const statusColorMap = {
        CREATED: "default",
        IN_PROGRESS: "primary",
        APPROVED: "warning",
        COMPLETED: "success",
        CANCELLED: "danger",
        PENDING_APPROVAL: "secondary"
    };

    return (
        <Card className="shadow-xl">
            <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Đơn Xuất Hàng Cần Xử Lý
                    </h2>
                    <div className="flex gap-3 w-[400px]">
                        <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse} />
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<Icon icon="mdi:refresh" />}
                            size="sm"
                            onClick={onRefresh}
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
                    <TableBody  isLoading={loading}
                                loadingContent={<Spinner label="Loading..." />}
                                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                emptyContent="Không có yêu cầu nào">
                        {exportOrders.map((order: ExportOrder) => (
                            <TableRow key={order.exportOrderId}>
                                <TableCell className="font-mono text-sm">
                                    #{order.exportOrderId.slice(-8)}
                                </TableCell>
                                <TableCell>{order.customer?.supplierName || "N/A"}</TableCell>
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
                                            onClick={() => onExecuteExport(order)}
                                            startContent={<Icon icon="mdi:eye" />}
                                        >
                                            Xem
                                        </Button>
                                        {order.status === "APPROVED" && (
                                            <Button
                                                size="sm"
                                                color="success"
                                                onClick={() => onExecuteExport(order)}
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
    );
}