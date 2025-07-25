import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Input,
    Select,
    SelectItem,
    Pagination,
    Avatar, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {useEffect, useState} from "react";
import OrderExportSlice, { ExportOrder } from "@/Store/ExportOrderSlice.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetOrderExportPending_Approve} from "@/Store/Thunk/ExportOrderThunk.tsx";
import {ExportOrderSelector} from "@/Store/Selector.tsx";
import SelectWarehouseApprove from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";

interface ExportOrderTableProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    onViewOrder: (order: ExportOrder) => void;
    onApproveOrder: (orderId: string) => void;
    onRejectOrder: (order: ExportOrder) => void;
}

export default function ExportOrderTable({
                                             searchValue,
                                             setSearchValue,
                                             statusFilter,
                                             setStatusFilter,
                                             onViewOrder,
                                             onApproveOrder,
                                             onRejectOrder
                                         }: ExportOrderTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const orders=useSelector(ExportOrderSelector);
    const [totalPages, setTotalPages] = useState(5);
    const [loading,setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState<string>("");
    const dispatch = useDispatch();
// Trong useEffect để fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const PageApi: pageApi = { pageNumber: currentPage - 1, pageSize: totalPages };
            dispatch(OrderExportSlice.actions.setOrderExportList([]));
            try {
                await (dispatch as any)(MiddleGetOrderExportPending_Approve(warehouses,PageApi));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, totalPages,warehouses]);
    const getStatusColor = (status: string) => {
        switch (status) {
            case "CREATED": return "warning";
            case "APPROVED": return "success";
            case "IN_PROGRESS": return "primary";
            case "COMPLETED": return "success";
            case "CANCELLED": return "danger";
            default: return "default";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "CREATED": return "Chờ duyệt";
            case "APPROVED": return "Đã duyệt";
            case "IN_PROGRESS": return "Đang xử lý";
            case "COMPLETED": return "Hoàn thành";
            case "CANCELLED": return "Đã hủy";
            default: return status;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            {/* Header với Search và Filter */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Danh Sách Yêu Cầu Xuất Hàng
                    </h2>

                    <div className="flex w-[500px] flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <SelectWarehouseApprove warehouse={warehouses} setWarehouse={setWarehouses}/>

                        <Select
                            label="Trạng thái"
                            selectedKeys={[statusFilter]}
                            onSelectionChange={(keys) => {
                                const status = Array.from(keys)[0]?.toString() || "all";
                                setStatusFilter(status);
                                setCurrentPage(1);
                            }}
                            className="w-full sm:max-w-[200px]"
                            size="sm"
                            variant="bordered"
                        >
                            <SelectItem key="all">Tất cả</SelectItem>
                            <SelectItem key="CREATED">Chờ duyệt</SelectItem>
                            <SelectItem key="APPROVED">Đã duyệt</SelectItem>
                            <SelectItem key="InProgress">Đang xử lý</SelectItem>
                            <SelectItem key="COMPLETED">Hoàn thành</SelectItem>
                            <SelectItem key="CANCELLED">Đã hủy</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table isCompact
                       removeWrapper
                       classNames={{
                           wrapper: "shadow-none",
                           th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                           td: "py-3",
                       }} aria-label="Export orders table">
                    <TableHeader>
                        <TableColumn>MÃ ĐỢN</TableColumn>
                        <TableColumn>NGÀY TẠO</TableColumn>
                        <TableColumn>NGƯỜI TẠO</TableColumn>
                        <TableColumn>KHÁCH HÀNG</TableColumn>
                        <TableColumn>SỐ LƯỢNG SP</TableColumn>
                        <TableColumn>TỔNG GIÁ TRỊ</TableColumn>
                        <TableColumn>TRẠNG THÁI</TableColumn>
                        <TableColumn align="center">THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                emptyContent="Không có yêu cầu nào"
                                isLoading={loading}
                               loadingContent={<Spinner label="Loading..." />}
                    >
                        {orders.map((order:ExportOrder) => (
                            <TableRow key={order.exportOrderId}>
                                <TableCell>
                                    <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        #{order.exportOrderId.slice(-8)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(order.requestDate).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            size="sm"
                                            isBordered
                                            color="primary"
                                            src={`https://dummyimage.com/300.png/09f/fff&text=${order?.createByUser?.userName}`}
                                        />
                                        <span className="font-medium">{order?.createByUser?.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{order?.customer?.supplierName}</div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        startContent={<Icon icon="mdi:package-variant" className="text-xs" />}
                                    >
                                        {order.itemCount || 0} sản phẩm
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                        {order?.totalAmount?.toLocaleString('vi-VN')} ₫
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={getStatusColor(order.status)}
                                        variant="flat"
                                        size="sm"
                                        startContent={
                                            order.status === "CREATED" ? <Icon icon="mdi:clock-outline" className="text-xs" /> :
                                                order.status === "APPROVED" ? <Icon icon="mdi:check-circle" className="text-xs" /> :
                                                    order.status === "IN_PROGRESS" ? <Icon icon="mdi:loading" className="text-xs animate-spin" /> :
                                                        order.status === "COMPLETED" ? <Icon icon="mdi:check-circle" className="text-xs" /> :
                                                            <Icon icon="mdi:close-circle" className="text-xs" />
                                        }
                                    >
                                        {getStatusText(order.status)}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-center">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            onClick={() => onViewOrder(order)}
                                        >
                                            <Icon icon="mdi:eye" />
                                        </Button>

                                        {order.status === "CREATED" && (
                                            <>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    onClick={() => onApproveOrder(order.exportOrderId)}
                                                >
                                                    <Icon icon="mdi:check" />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => onRejectOrder(order)}
                                                >
                                                    <Icon icon="mdi:close" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-6 pb-4 gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hiển thị {orders.length} yêu cầu
                </div>
                <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    size="sm"
                    showControls
                    classNames={{
                        wrapper: "gap-0 overflow-visible h-8",
                        item: "w-8 h-8 text-small rounded-none bg-transparent",
                        cursor: "bg-blue-600 shadow-lg from-blue-600 to-blue-600 text-white font-bold",
                    }}
                />
            </div>
        </div>
        )
};