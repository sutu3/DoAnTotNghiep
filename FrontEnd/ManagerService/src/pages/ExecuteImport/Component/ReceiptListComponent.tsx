"use client";

import {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Input,
    Pagination,
    Select,
    SelectItem, Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import {Calendar, Edit, Eye, Package, Plus, Search} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllOrderItemByStatus} from "@/pages/ExecuteImport/Store/Thunk/ImportOrderThunk.tsx";
import {OrderSelector, ReceiptWarehousesSelector, TotalPageReceipt} from "@/Store/Selector.tsx";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";
import {MiddleGetReceiptByWarehouseId} from "@/pages/ExecuteImport/Store/Thunk/WarehousReceipteThunk.tsx";
import WarehousReceipteSlice from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";
import OrderImportSlice from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";

interface ReceiptListComponentProps {
    onViewDetail: (receipt: any) => void;
    onEditReceipt: (receipt: any) => void;
    onCreateFromOrder: (order: any) => void;
}

const ReceiptListComponent: React.FC<ReceiptListComponentProps> = ({
                                                                       onViewDetail,
                                                                       onEditReceipt,
                                                                       onCreateFromOrder
                                                                   }) => {
    const receipts=useSelector(ReceiptWarehousesSelector)
    const readyOrders = useSelector(OrderSelector)
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [warehouse, setWarehouse] = useState("");
    const dispatch = useDispatch();
    const totalPage=useSelector(TotalPageReceipt)
    useEffect(() => {
         loadReceipts();
        loadReadyOrders();
    }, [warehouse,statusFilter, searchTerm, currentPage]);
    useEffect(() => {
        dispatch(OrderImportSlice.actions.setOrderImportList([]))
    }, []);
    console.log(totalPage)
    const pages=totalPage;
    const loadReceipts = async () => {
        setLoading(true);
        dispatch(WarehousReceipteSlice.actions.setReceiptWarehouseList([]))
        try {
            // API call to get warehouse receipts
            if (warehouse != "") {
                console.log("Mã phieeus:", searchTerm);
                const status=statusFilter=="all" ? null : statusFilter;
                const receiptId=searchTerm=="" ? null : searchTerm;
                const page :pageApi= {pageNumber:currentPage-1,pageSize:5}
                await (dispatch as any)(MiddleGetReceiptByWarehouseId(warehouse,status,receiptId,page))
            }
        } catch (error) {
            console.error("Error loading receipts:", error);
        } finally {
            setLoading(false);
        }
    };


    const loadReadyOrders = async () => {
        try {
            // API call to get orders ready for receipt
            if (warehouse != "") {
                await (dispatch as any)(MiddleGetAllOrderItemByStatus(warehouse))
            }
        } catch (error) {
            console.error("Error loading ready orders:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'PARTIAL':
                return 'primary';
            case 'COMPLETED':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xử lý';
            case 'PARTIAL':
                return 'Nhập một phần';
            case 'COMPLETED':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    const filteredReceipts = receipts;

    return (
        <div className="space-y-6">
            {/* Ready Orders Section */}
            {readyOrders.length > 0 && (
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-600"/>
                                <h3 className="text-lg font-semibold text-green-800">
                                    Đơn Hàng Sẵn Sàng Nhập Kho
                                </h3>
                            </div>
                            <span className="text-sm text-green-600">
                                {readyOrders.length} đơn hàng
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {readyOrders.map((order: any) => (
                                <Card key={order.importOrderId} className="border hover:shadow-md transition-shadow">
                                    <CardBody className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-sm text-gray-600">
                                                    #{order.importOrderId.slice(-8)}
                                                </span>
                                                <Chip color="success" variant="flat" size="sm">
                                                    Sẵn sàng
                                                </Chip>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {order.itemCount || 0} sản phẩm
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3"/>
                                                {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                fullWidth
                                                startContent={<Plus className="w-4 h-4"/>}
                                                onClick={() => onCreateFromOrder(order)}
                                            >
                                                Tạo Phiếu Nhập
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Receipts List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Danh Sách Phiếu Nhập Kho
                        </h3>
                        <div className="flex gap-3">
                            <Input
                                placeholder="Tìm kiếm phiếu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startContent={<Search className="w-4 h-4 text-gray-400"/>}
                                size="sm"
                                className="w-64"
                            />
                            <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse}/>
                            <Select
                                aria-labelledby="Input"
                                placeholder="Trạng thái"
                                selectedKeys={[statusFilter]}
                                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                                size="sm"
                                className="w-40"
                            >
                                <SelectItem aria-labelledby="Input"
                                            key="all">Tất cả</SelectItem>
                                <SelectItem aria-labelledby="Input"
                                            key="PENDING">Chờ xử lý</SelectItem>
                                <SelectItem aria-labelledby="Input"
                                            key="PARTIAL">Nhập một phần</SelectItem>
                                <SelectItem aria-labelledby="Input"
                                            key="COMPLETED">Hoàn thành</SelectItem>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table aria-labelledby="Input"
                    >
                        <TableHeader>
                            <TableColumn>MÃ PHIẾU</TableColumn>
                            <TableColumn>ĐỚN HÀNG</TableColumn>
                            <TableColumn>NGÀY TẠO</TableColumn>
                            <TableColumn>TRẠNG THÁI</TableColumn>
                            <TableColumn>SỐ LƯỢNG SP</TableColumn>
                            <TableColumn>THAO TÁC</TableColumn>
                        </TableHeader>
                        <TableBody
                            loadingContent={<Spinner label="Loading..." />}
                            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                            isLoading={loading}
                            emptyContent="Không có phiếu nhập kho nào"
                        >
                            {filteredReceipts?.map((receipt: any) => (
                                <TableRow key={receipt.receiptId}>
                                    <TableCell>
                                        <span className="font-mono text-sm">
                                            #{receipt.receiptId.slice(-8)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm text-gray-600">
                                            #{receipt.importOrderId.slice(-8)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(receipt.receivedDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            color={getStatusColor(receipt.status)}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {getStatusText(receipt.status)}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {receipt.quantityReceiveItem || 0} sản phẩm
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                startContent={<Eye className="w-4 h-4"/>}
                                                onClick={() => onViewDetail(receipt)}
                                            >
                                                Xem
                                            </Button>
                                            {receipt.status !== 'COMPLETED' && (
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    variant="flat"
                                                    startContent={<Edit className="w-4 h-4"/>}
                                                    onClick={() => onEditReceipt(receipt)}
                                                >
                                                    Sửa
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <Pagination
                            total={pages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            showControls
                            classNames={{
                                cursor: "bg-blue-600 text-white"
                            }}
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ReceiptListComponent;