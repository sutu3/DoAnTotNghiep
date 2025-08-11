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
    Tooltip, Pagination
} from "@heroui/react";
import { Icon } from "@iconify/react";
import  { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeliveryStatusSelect from "@/pages/ExecuteExport/Component/Select/DeliveryStatusSelect.tsx";
import {
    MiddleGetAllWarehouseDeliveryByStatus,
    MiddleUpdateWarehouseDelivery
} from "@/pages/ExecuteExport/Store/Thunk/WarehouseDeliveryThunk.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import {DeliveryWarehouseSelector, TotalPageReceipt} from "@/pages/ExecuteExport/Store/Selector.tsx";
import {
    setDeliveries,
} from "@/pages/ExecuteExport/Store/WarehouseDeliverySlice.tsx";
import WarehouseSelect from "@/pages/ExecuteExport/Component/Select/WarehouseSelect.tsx";

interface DeliveryListComponentProps {
    onCreateNew: () => void;
    onViewDelivery?: (delivery: any) => void;
}

export default function DeliveryListComponent({ onCreateNew,onViewDelivery }: DeliveryListComponentProps) {
    const dispatch = useDispatch();
    const deliveries = useSelector(DeliveryWarehouseSelector);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [warehouse, setWarehouse] = useState<string>("");
    const [page, setPage] = useState(1);
    const pages=useSelector(TotalPageReceipt);
    useEffect(() => {
        const fetchDeliveries = async () => {
            setLoading(true);
            dispatch(setDeliveries([]));
                const pageApi: pageApi = { pageNumber: page-1, pageSize: 5 };
                if(warehouse!=""){
                    if (statusFilter === "all") {
                        await (dispatch as any)(MiddleGetAllWarehouseDeliveryByStatus(warehouse, null, pageApi));
                        setLoading(false)
                    } else {
                        await (dispatch as any)(MiddleGetAllWarehouseDeliveryByStatus(warehouse, statusFilter, pageApi));
                        setLoading(false)
                    }
                }


        };
        if(warehouse!="all"){
            fetchDeliveries();
        }

    }, [ statusFilter, warehouse,page]);
    console.log(loading)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_PROGRESS': return 'primary';
            case 'COMPLETED': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'IN_PROGRESS': return 'Đang xử lý';
            case 'COMPLETED': return 'Hoàn thành';
            default: return status;
        }
    };

    const handleCompleteDelivery = (deliveryId: string) => {
        // Logic hoàn thành phiếu xuất
        const fetch=async ()=>{
            await(dispatch as any)(MiddleUpdateWarehouseDelivery(deliveryId));
        }
        fetch()
        console.log("Complete delivery:", deliveryId);
    };


    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-600 rounded-lg p-2">
                            <Icon icon="mdi:truck-delivery" className="text-xl text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Danh Sách Phiếu Xuất Kho</h2>
                            <p className="text-sm text-gray-600">Quản lý và theo dõi các phiếu xuất kho</p>
                        </div>
                    </div>

                    <Button
                        color="primary"
                        startContent={<Icon icon="mdi:plus" />}
                        onPress={onCreateNew}
                        className="bg-gradient-to-r from-orange-500 to-red-600 font-semibold"
                        size="lg"
                    >
                        Tạo phiếu mới
                    </Button>
                </div>
            </CardHeader>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex gap-4 items-center">
                    <DeliveryStatusSelect
                        selectedStatus={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                    <WarehouseSelect warehouse={warehouse} setWarehouse={setWarehouse} />
                    <div className="ml-auto">
                        <Chip color="primary" variant="flat">
                            {deliveries.length} phiếu xuất
                        </Chip>
                    </div>
                </div>
            </div>

            <CardBody className="p-0">
                <Table
                    aria-label="Deliveries table"
                >
                    <TableHeader>
                        <TableColumn>MÃ PHIẾU</TableColumn>
                        <TableColumn>ĐƠN XUẤT HÀNG</TableColumn>
                        <TableColumn>NGƯỜI TẠO</TableColumn>
                        <TableColumn>KHÁCH HÀNG</TableColumn>
                        <TableColumn>NGÀY TẠO</TableColumn>
                        <TableColumn>TRẠNG THÁI</TableColumn>
                        <TableColumn align="center">THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody
                        loadingContent={<Spinner label="Loading..." />}
                        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                        isLoading={loading}
                        emptyContent="Không có phiếu nhập kho nào"
                    >
                        {deliveries.map((delivery: any) => (
                            <TableRow key={delivery.deliveryId} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <code className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-mono">
                                            #{delivery.deliveryId?.slice(-8)}
                                        </code>
                                        {delivery.notes && (
                                            <Tooltip content={delivery.notes}>
                                                <Icon icon="mdi:note-text" className="text-gray-400 text-xs mt-1" />
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mb-1">
                                            #{delivery?.exportOrderId?.slice(-8)}
                                        </code>
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:warehouse" className="text-blue-600 text-xs" />
                                            <span className="text-xs text-gray-500">
                                                {delivery.warehouse?.warehouseName}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={delivery.createdByUser?.urlImage}
                                            name={delivery.createdByUser?.userName}
                                            size="sm"
                                            className="bg-purple-100"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">
                                                {delivery.createdByUser?.userName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {delivery.createdByUser?.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            src={delivery.exportOrder?.customer?.urlSupplier}
                                            name={delivery.exportOrder?.customer?.supplierName}
                                            size="sm"
                                            className="bg-green-100"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">
                                                {delivery.exportOrder?.customer?.supplierName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Tổng: {delivery.exportOrder?.totalAmount?.toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {delivery.deliveryDate &&
                                                new Date(delivery.deliveryDate).toLocaleDateString('vi-VN')
                                            }
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {delivery.deliveryDate &&
                                                new Date(delivery.deliveryDate).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                            }
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        color={getStatusColor(delivery.status)}
                                        variant="flat"
                                        size="sm"
                                        startContent={
                                            delivery.status === 'PENDING' ? <Icon icon="mdi:clock-outline" className="text-xs" /> :
                                                delivery.status === 'IN_PROGRESS' ? <Icon icon="mdi:loading" className="text-xs animate-spin" /> :
                                                    <Icon icon="mdi:check-circle" className="text-xs" />
                                        }
                                    >
                                        {getStatusText(delivery.status)}
                                    </Chip>
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        <Tooltip content="Xem chi tiết">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                className="text-blue-600 hover:bg-blue-50"
                                                onPress={() => onViewDelivery?.(delivery)}
                                            >
                                                <Icon icon="mdi:eye" />
                                            </Button>
                                        </Tooltip>
                                        {delivery.status === 'PENDING' && (
                                            <Tooltip content="Hoàn thành phiếu xuất">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    onPress={() => handleCompleteDelivery(delivery.deliveryId)}
                                                >
                                                    <Icon icon="mdi:check" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-center mt-4">
                    <Pagination
                        total={pages}
                        page={page}
                        onChange={setPage}
                        showControls
                        classNames={{
                            cursor: "bg-blue-600 text-white"
                        }}
                    />
                </div>
            </CardBody>
        </Card>
    );
}