// pages/ExecuteImport/page.tsx
import  { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MiddleGetAllImportOrderByStatus } from '@/pages/ExecuteImport/Store/ImportOrderThunk.tsx';
import { OrderSelector } from '@/Store/Selector';
import { Package, Eye, Clock, CheckCircle } from 'lucide-react';
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";
import {MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";

const ExecuteImportPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(OrderSelector);
    const [loading, setLoading] = useState(false);
    const [warehouse,setWarehouse] = useState<string>("");

    useEffect(() => {
            loadOrders()
        },
        [warehouse]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const PageApi:pageApi={pageNumber:0,pageSize:10}
            // Lấy orders với status "InProgress" - đã được approve
            if(warehouse!=""){
                await (dispatch as any)(MiddleGetAllImportOrderByStatus(warehouse,"InProgress",PageApi));
                await (dispatch as any)(MiddleGetAllStackList(warehouse));
            }        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (orderId: string) => {
        navigate(`/staff/import/details?orderId=${orderId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'InProgress': return 'warning';
            case 'Done': return 'success';
            case 'Created': return 'default';
            case 'Cancel': return 'danger';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'InProgress': return 'Chờ nhập kho';
            case 'Done': return 'Đã hoàn thành';
            case 'Created': return 'Chờ duyệt';
            case 'Cancel': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Thực hiện nhập kho
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Danh sách đơn hàng chờ nhập kho
                            </p>
                        </div>
                    </div>
                </div>
                {/* Orders List */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Đơn hàng nhập kho
                            </h2>
                            <div className={"flex items-center gap-3 w-[300px]"}>
                                <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse} />
                                <Button
                                    color="primary"
                                    variant="light"
                                    startContent={<Icon icon="mdi:refresh" />}
                                    onClick={loadOrders}
                                    isLoading={loading}
                                >
                                    Làm mới
                                </Button>
                            </div>

                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Import orders table">
                            <TableHeader>
                                <TableColumn>MÃ ĐỚN</TableColumn>
                                <TableColumn>NGÀY TẠO</TableColumn>
                                <TableColumn>TRẠNG THÁI</TableColumn>
                                <TableColumn>GHI CHÚ</TableColumn>
                                <TableColumn>THAO TÁC</TableColumn>
                            </TableHeader>
                            <TableBody  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                        isLoading={loading}
                                        loadingContent={<Spinner label="Loading..." />}
                                        emptyContent={"No object found"} >
                                {orders?.map((order: any) => (
                                    <TableRow key={order.importOrderId}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span className="font-mono text-sm">
                                                    {order.importOrderId?.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">
                                                    {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={getStatusColor(order.status)}
                                                variant="flat"
                                                size="sm"
                                                startContent={
                                                    order.status === 'Done' ?
                                                        <CheckCircle className="w-3 h-3" /> :
                                                        <Clock className="w-3 h-3" />
                                                }
                                            >
                                                {getStatusText(order.status)}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                                                {order.note || 'Không có ghi chú'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="light"
                                                size="sm"
                                                startContent={<Eye className="w-4 h-4" />}
                                                onClick={() => handleViewDetails(order.importOrderId)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ExecuteImportPage;