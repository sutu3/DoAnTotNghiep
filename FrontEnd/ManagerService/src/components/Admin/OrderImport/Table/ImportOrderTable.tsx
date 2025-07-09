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
    Pagination, Avatar
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {getStatusColor, getStatusText} from "@/Utils/statusHelpers.tsx";
import {useEffect, useState} from "react";
import {pageApi} from "@/Constants/UrlApi.tsx";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllOrder} from "@/Store/Thunk/ImportOrderThunk.tsx";
import {ImportOrder} from "@/Store/ImportOrder.tsx";
import {OrderSelector, TotalPageOrder} from "@/Store/Selector.tsx";

interface ImportOrderTableProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    onViewOrder: (order: ImportOrder) => void;
    onApproveOrder: (orderId: string) => void;
    onRejectOrder: (order: ImportOrder) => void;
}

export default function ImportOrderTable({
                                             searchValue,
                                             setSearchValue,
                                             statusFilter,
                                             setStatusFilter,
                                             onViewOrder,
                                             onApproveOrder,
                                             onRejectOrder
                                         }: ImportOrderTableProps) {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages=useSelector(TotalPageOrder);
    const orders=useSelector(OrderSelector);
    useEffect(() => {
        const PageApi: pageApi = { pageNumber: currentPage - 1, pageSize: 5 };
        const fetchData = async () => {
            (dispatch as any)(MiddleGetAllOrder(PageApi));
        };
        fetchData();

    }, []);


    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Danh Sách Yêu     </h2>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Input
                            isClearable
                            classNames={{
                                base: "w-full sm:max-w-[300px]",
                                inputWrapper: "border-1",
                            }}
                            placeholder="Tìm kiếm theo mã đơn, người tạo..."
                            size="sm"
                            startContent={<Icon icon="mdi:magnify" className="text-default-300"/>}
                            value={searchValue}
                            variant="bordered"
                            onClear={() => setSearchValue("")}
                            onValueChange={setSearchValue}
                        />

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
                            <SelectItem key="Created">Chờ duyệt</SelectItem>
                            <SelectItem key="InProgress">Đang xử lý</SelectItem>
                            <SelectItem key="Completed">Hoàn thành</SelectItem>
                            <SelectItem key="Cancel">Đã hủy</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="p-0 md:p-4">
                <Table
                    isCompact
                    removeWrapper
                    aria-label="Import orders table"
                    classNames={{
                        wrapper: "shadow-none",
                        th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                        td: "py-3",
                    }}
                >
                    <TableHeader>
                        <TableColumn>MÃ ĐON</TableColumn>
                        <TableColumn>NGÀY TẠO</TableColumn>
                        <TableColumn>NGƯỜI TẠO</TableColumn>
                        <TableColumn>SỐ SẢN PHẨM</TableColumn>
                        <TableColumn>TỔNG GIÁ TRỊ</TableColumn>
                        <TableColumn>TRẠNG THÁI</TableColumn>
                        <TableColumn align="center">THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody
                        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                        emptyContent="Không có yêu cầu nào"
                    >
                        {orders.map((order:ImportOrder) => (
                            <TableRow
                                key={order.importOrderId}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <TableCell>
                                    <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        #{order.importOrderId.slice(-8)}
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
                                        {order?.createByUser?
                                            <Avatar size="sm" isBordered color="primary" src={`https://dummyimage.com/300.png/09f/fff&text=${order?.createByUser?.userName}`} />
                                            :
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <Icon icon="mdi:account" className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                        }
                                        <span className="font-medium">{order?.createByUser?.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        startContent={<Icon icon="mdi:package-variant" className="text-xs" />}
                                    >
                                        {order.items?.length || 0} sản phẩm
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                        {order.totalValue?.toLocaleString('vi-VN')} ₫
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={getStatusColor(order.status)}
                                        variant="flat"
                                        size="sm"
                                        startContent={
                                            order.status === "Created" ? <Icon icon="mdi:clock-outline" className="text-xs" /> :
                                                order.status === "InProgress" ? <Icon icon="mdi:loading" className="text-xs animate-spin" /> :
                                                    order.status === "Completed" ? <Icon icon="mdi:check-circle" className="text-xs" /> :
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

                                        {order.status === "Created" && (
                                            <>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    onClick={() => onApproveOrder(order.importOrderId)}
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

                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hiển thị {orders.length} trong tổng số {orders.length} yêu cầu
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
        </div>
    );
}