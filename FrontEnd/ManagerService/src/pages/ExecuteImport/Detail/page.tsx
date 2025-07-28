import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';
import {Card, CardBody, CardHeader, Button, Input, Progress, Divider, Badge,} from '@heroui/react';
import { ArrowLeft, Package, MapPin, Hash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { MiddleGetAllOrderItem, MiddleImportOrder } from '@/pages/ExecuteImport/Store/ImportOrderThunk.tsx';
import {OrderItemSelector, StacksSelector} from '@/Store/Selector';
import LocationSelectionModal from "@/components/Staff/ExecuteImport/Modal/LocationSelectionModal.tsx";
import {ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {Bin, StackType} from "@/Store/StackSlice.tsx";

const ImportOrderDetailsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const dispatch = useDispatch();
    const orderItems:ImportOrderItem[] = useSelector(OrderItemSelector);
    const [loading, setLoading] = useState(false);
    const [importItems, setImportItems] = useState<ImportOrderItem[]>([]);

    // States cho LocationSelectionModal  
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [warehouse, setWarehouse] = useState<any>(null);
    const stacksBinData=useSelector(StacksSelector)

    // Existing useEffect and handlers remain the same...  
    useEffect(() => {
        if (orderId) {
            loadOrderItems();
        }
    }, [orderId]);

    const loadOrderItems = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllOrderItem(orderId!));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderItems) {
            setImportItems(orderItems.map((item: any) => ({
                ...item,
                realityQuantity: item.requestQuantity,
                bin: item.bin || null,
            })));

        }
    }, [orderItems]);

    const handleQuantityChange = (index: number, value: string) => {
        const newItems = [...importItems];
        newItems[index].realityQuantity = parseInt(value) || 0;
        setImportItems(newItems);
    };

    const handleOpenLocationModal = (index: number) => {
        setSelectedItemIndex(index);
        setIsLocationModalOpen(true);
    };

    const handleConfirmLocation = (stackId: string, binId: string) => {
        console.log(selectedItemIndex)
        if (selectedItemIndex!=null) {
            // Tìm stack và bin chính xác
            const selectedStackData = stacksBinData.find((stack: StackType) => stack.stackId === stackId);
            const selectedBinData = selectedStackData?.bin.find((bin: Bin) => bin.binId === binId);

            console.log(selectedStackData);
            console.log(selectedBinData);

            setImportItems(prev => prev.map((item,index) =>
                index === selectedItemIndex
                    ? {
                        ...item,
                        bin: selectedBinData,             // Nếu bạn muốn lưu mã Bin
                    }
                    : item
            ));
            setIsLocationModalOpen(false);
            setSelectedItemIndex(null);
        }
    };


    const handleExecuteImport = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleImportOrder(orderId, importItems));
            navigate('/staff/import');
        } finally {
            setLoading(false);
        }
    };

    // Calculate progress  
    const completedItems = importItems.filter(item => item.bin?.binId && item.realityQuantity > 0).length;
    const progressPercentage = importItems.length > 0 ? (completedItems / importItems.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header with Progress */}
                <div className="mb-8">
                    <Button
                        variant="light"
                        startContent={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/staff/import')}
                        className="mb-6"
                    >
                        Quay lại danh sách
                    </Button>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        Chi tiết đơn nhập kho
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Mã đơn: <span className="font-mono">{orderId?.substring(0, 8)}...</span>
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {completedItems}/{importItems.length}
                                </div>
                                <p className="text-sm text-gray-500">Sản phẩm hoàn thành</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tiến độ nhập kho</span>
                                <span className="font-medium">{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress
                                value={progressPercentage}
                                color={progressPercentage === 100 ? "success" : "primary"}
                                className="h-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Items List - Takes 3/4 of the width */}
                    <div className="xl:col-span-3 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            Danh sách sản phẩm ({importItems.length})
                        </h2>

                        {importItems.map((item, index) => (
                            <Card className="mb-6 shadow-sm border border-gray-200">
                                <CardHeader className="flex items-start justify-between pb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{item.product.productName}</h3>
                                        <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                                    </div>
                                    <Badge variant="flat" color="warning" className="text-sm">
                                        Chưa hoàn thành
                                    </Badge>
                                </CardHeader>

                                <CardBody className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* Số lượng yêu cầu */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <label className="text-sm font-medium text-blue-600">Số lượng yêu cầu</label>
                                            <div className="text-3xl font-bold text-blue-700 mt-1">{item.requestQuantity}</div>
                                            <div className="text-sm text-blue-500">{item.unit?.unitName || 'Đơn vị'}</div>
                                        </div>

                                        {/* Số lượng thực tế */}
                                        {/* Số lượng thực tế */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <label className="text-sm font-medium text-gray-600 mb-1">Số lượng thực tế</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={item.realityQuantity?.toString() || ''}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                startContent={<Hash className="w-4 h-4 text-gray-400" />}
                                                classNames={{
                                                    input: "text-lg font-semibold",
                                                    inputWrapper: "h-14"
                                                }}
                                            />
                                        </div>


                                        {/* Vị trí kho */}
                                        <div className="col-span-1">
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Vị trí kho</label>
                                            <Button
                                                variant="bordered"
                                                onClick={() => handleOpenLocationModal(index)}
                                                startContent={<MapPin className="w-4 h-4" />}
                                                className="w-full justify-start h-12"
                                                color={item.bin?.binId ? "success" : "default"}
                                            >
                                                {item.bin?.binId
                                                    ? ` ${item.bin.binId}`
                                                    : 'Chọn vị trí'}
                                            </Button>
                                        </div>

                                        {/* Giá & thành tiền */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <label className="text-sm font-medium text-green-600">Đơn giá</label>
                                            <div className="text-xl font-bold text-green-700 mt-1">
                                                {item.costUnitBase?.toLocaleString('vi-VN')} ₫
                                            </div>
                                            <div className="text-sm text-green-600">
                                                Thành tiền: {(item.realityQuantity * item.costUnitBase).toLocaleString('vi-VN')} ₫
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Summary Sidebar - Takes 1/4 of the width */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Summary Card */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Tóm tắt đơn hàng
                                    </h3>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Tổng sản phẩm:</span>
                                        <span className="font-semibold">{importItems.length}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Đã hoàn thành:</span>
                                        <span className="font-semibold text-green-600">{completedItems}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Còn lại:</span>
                                        <span className="font-semibold text-orange-600">{importItems.length - completedItems}</span>
                                    </div>

                                    <Divider />

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Tổng giá trị:</span>
                                        <span className="font-bold text-lg text-blue-600">  
                                            {importItems.reduce((total, item) =>
                                                total + ((item.realityQuantity || 0) * (item.costUnitBase || 0)), 0
                                            ).toLocaleString('vi-VN')} ₫  
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Action Buttons */}
                            <Card className="shadow-lg">
                                <CardBody className="space-y-3">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        fullWidth
                                        onClick={() => navigate('/staff/import')}
                                        startContent={<ArrowLeft className="w-4 h-4" />}
                                    >
                                        Hủy bỏ
                                    </Button>

                                    <Button
                                        color="success"
                                        fullWidth
                                        onClick={handleExecuteImport}
                                        isLoading={loading}
                                        isDisabled={completedItems !== importItems.length}
                                        startContent={<Package className="w-4 h-4" />}
                                    >
                                        {loading ? 'Đang thực hiện...' : 'Thực hiện nhập kho'}
                                    </Button>
                                </CardBody>
                            </Card>

                            {/* Warehouse Info Card */}
                            {warehouse && (
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            Thông tin kho
                                        </h3>
                                    </CardHeader>
                                    <CardBody className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                                <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Tên kho</p>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {warehouse.warehouseName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                                    {warehouse.address || 'Chưa có địa chỉ'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* LocationSelectionModal */}
                <LocationSelectionModal
                    warehouse={warehouse}
                    isOpen={isLocationModalOpen}
                    onClose={() => setIsLocationModalOpen(false)}
                    selectedItem={selectedItemIndex !== null ? importItems[selectedItemIndex] : null}
                    onConfirmLocation={handleConfirmLocation}
                    warehouseId={warehouse?.warehouseId}
                />
            </div>
        </div>
    );
};

export default ImportOrderDetailsPage;
                  