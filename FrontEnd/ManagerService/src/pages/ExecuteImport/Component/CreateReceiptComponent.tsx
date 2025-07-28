// FrontEnd/ManagerService/src/pages/Staff/WarehouseReceipt/components/CreateReceiptComponent.tsx
"use client";

import {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea
} from "@heroui/react";
import {ArrowLeft, MapPin, Package, Save} from "lucide-react";
import OrderImportSlice, {ImportOrder, ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {MiddleGetAllOrderItemByOrderId, MiddleImportOrder} from "@/pages/ExecuteImport/Store/ImportOrderThunk.tsx";
import {useDispatch, useSelector} from "react-redux";
import {OrderItemSelector, OrderSelector, StacksSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {Bin, StackType} from "@/Store/StackSlice";
import LocationSelectionModal from "@/components/Staff/ExecuteImport/Modal/LocationSelectionModal.tsx";
import {ReceiptWarehouseCreate} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";

interface CreateReceiptComponentProps {
    setSelectedOrder: (selectedOrder: ImportOrder) => void;
    selectedOrder?: ImportOrder;
    onSuccess: () => void;
}

const CreateReceiptComponent: React.FC<CreateReceiptComponentProps> = ({setSelectedOrder,
                                                                           selectedOrder,
                                                                           onSuccess
                                                                       }) => {
    const availableOrders = useSelector(OrderSelector);
    const orderItem = useSelector(OrderItemSelector);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const stacksBinData = useSelector(StacksSelector)
    const [currentOrder, setCurrentOrder] = useState<ImportOrder | undefined>(selectedOrder);
    const [receiptNote, setReceiptNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [warehouse,setWarehouse] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        loadAvailableOrders();
    }, [warehouse,selectedOrder]);
    useEffect(() => {
        dispatch(OrderImportSlice.actions.setOrderImportList([]))
    }, []);
    const loadAvailableOrders = async () => {
        try {

            await (dispatch as any)(MiddleGetAllOrderItemByOrderId(selectedOrder?.importOrderId));
            if(selectedOrder){
                await (dispatch as any)(MiddleGetAllStackList(selectedOrder?.warehouse?.warehouseId));
            }else{
                if(warehouse!=""){
                    await (dispatch as any)(MiddleGetAllStackList(warehouse));
                }
            }
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = orderItem.map((item: ImportOrderItem, i: number) =>
            i === index ? {...item, [field === 'receivedQuantity' ? 'realityQuantity' : field]: value} : item
        );
        dispatch(OrderImportSlice.actions.setOrderImportItemList(updatedItems));
    };
    const handleOpenLocationModal = (index: number) => {
        setSelectedItemIndex(index);
        setIsLocationModalOpen(true);
    };

    const handleConfirmLocation = (stackId: string, binId: string) => {
        if (selectedItemIndex !== null) {
            // Tìm stack và bin chính xác
            const selectedStackData = stacksBinData.find((stack: StackType) => stack.stackId === stackId);
            const selectedBinData = selectedStackData?.bin.find((bin: Bin) => bin.binId === binId);

            // Cập nhật receiptItems với bin location
            const updatedItems = orderItem.map((item: ImportOrderItem, index: number) =>
                index === selectedItemIndex
                    ? {
                        ...item,
                        bin: selectedBinData,
                    }
                    : item
            );
            console.log(updatedItems);
            // Dispatch action để update store
            dispatch(OrderImportSlice.actions.setOrderImportItemList(updatedItems));

            setIsLocationModalOpen(false);
            setSelectedItemIndex(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (currentOrder) {
                const receiptData: ReceiptWarehouseCreate = {
                    importOrderId: currentOrder?.importOrderId,
                    note: receiptNote,
                    receiptItems: orderItem
                        .filter((item: ImportOrderItem) => item.realityQuantity > 0)
                        .map((item: ImportOrderItem) => ({
                            importItemId: item?.itemId,
                            receivedQuantity: item?.realityQuantity,
                            binLocation: item?.bin?.binId,
                            note: item?.note,
                        }))
                };
                await (dispatch as any)(MiddleImportOrder(selectedOrder?.importOrderId || "", orderItem, receiptData));
            }
        } catch (error) {
            console.error("Error creating receipt:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalReceived = () => {
        return orderItem.reduce((total: number, item: ImportOrderItem) => total + item.realityQuantity, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card aria-labelledby="Input"
            >
                <CardHeader aria-labelledby="Input"
                >
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-blue-600"/>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Tạo Phiếu Nhập Kho Mới
                            </h2>
                            <p className="text-sm text-gray-500">
                                Chọn đơn hàng và nhập thông tin sản phẩm nhận được
                            </p>
                        </div>
                    </div>
                    <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse}/>

                </CardHeader>
                <CardBody aria-labelledby="Input"
                >
                    {!selectedOrder && (
                        <Select aria-labelledby="Input"

                                label="Chọn đơn hàng nhập"
                                placeholder="Chọn đơn hàng để tạo phiếu nhập kho"
                                selectedKeys={currentOrder ? [currentOrder.importOrderId] : []}
                                onSelectionChange={(keys) => {
                                    const orderId = Array.from(keys)[0] as string;
                                    const order = availableOrders.find((o: any) => o.importOrderId === orderId);
                                    setSelectedOrder(order)
                                    setCurrentOrder(order);
                                }}
                        >
                            {availableOrders?.map((order: any) => (
                                <SelectItem aria-labelledby="Input"
                                            key={order.importOrderId} value={order.importOrderId}>
                                    <div className="flex flex-col">
                                        <span>#{order.importOrderId.slice(-8)}</span>
                                        <span className="text-xs text-gray-500">
                                            {order.importItems?.length} sản phẩm - {new Date(order.requestDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    {currentOrder && (
                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Thông tin đơn hàng</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Mã đơn:</span>
                                    <span className="ml-2 font-mono">#{currentOrder.importOrderId.slice(-8)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span
                                        className="ml-2">{new Date(currentOrder.requestDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Receipt Items */}
            {currentOrder && (
                <Card aria-labelledby="Input"
                >
                    <CardHeader aria-labelledby="Input"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">
                            Danh Sách Sản Phẩm Nhập Kho
                        </h3>

                    </CardHeader>
                    <CardBody aria-labelledby="Input"
                    >
                        <Table>
                            <TableHeader aria-labelledby="Input"
                            >
                                <TableColumn aria-labelledby="Input"
                                >SẢN PHẨM</TableColumn>
                                <TableColumn aria-labelledby="Input"
                                >SL YÊU CẦU</TableColumn>
                                <TableColumn aria-labelledby="Input"
                                >SL THỰC NHẬN</TableColumn>
                                <TableColumn aria-labelledby="Input"
                                >VỊ TRÍ</TableColumn>
                                <TableColumn aria-labelledby="Input"
                                >GHI CHÚ</TableColumn>
                            </TableHeader>
                            <TableBody aria-labelledby="Input"
                            >
                                {orderItem?.map((item: ImportOrderItem, index: number) => (
                                    <TableRow aria-labelledby="Input"
                                              key={index}>
                                        <TableCell aria-labelledby="Input"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={item?.product?.urlImageProduct}
                                                    size="sm"
                                                    fallback={<Package className="w-4 h-4"/>}
                                                />
                                                <div>
                                                    <p className="font-medium">{item?.product?.productName}</p>
                                                    <p className="text-xs text-gray-500">{item.unit?.unitName}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell aria-labelledby="Input"
                                        >
                                            <span className="font-semibold text-blue-600">
                                                {item.requestQuantity}
                                            </span>
                                        </TableCell>
                                        <TableCell aria-labelledby="Input"
                                        >
                                            <Input
                                                type="number"
                                                size="sm"
                                                value={item.realityQuantity.toString()}
                                                onChange={(e) => handleItemChange(
                                                    index,
                                                    'receivedQuantity',
                                                    parseInt(e.target.value) || 0
                                                )}
                                                max={item.requestQuantity}
                                                className="w-24"
                                            />
                                        </TableCell>
                                        <TableCell aria-labelledby="Input"
                                        >
                                            <Button
                                                aria-labelledby="Input"
                                                variant="bordered"
                                                onClick={() => handleOpenLocationModal(index)}
                                                startContent={<MapPin className="w-4 h-4"/>}
                                                className="w-full justify-start h-10"
                                                color={item.bin?.binId ? "success" : "default"}
                                                size="sm"
                                            >
                                                {item.bin?.binId
                                                    ? `${item.bin.binId}`
                                                    : 'Chọn vị trí'}
                                            </Button>
                                        </TableCell>
                                        <TableCell aria-labelledby="Input"
                                        >
                                            <Input
                                                aria-labelledby="Input"
                                                size="sm"
                                                placeholder="Ghi chú"
                                                value={item.note}
                                                onChange={(e) => handleItemChange(
                                                    index,
                                                    'note',
                                                    e.target.value
                                                )}
                                                className="w-40"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Tổng số lượng nhận:</span>
                                <span className="text-xl font-bold text-green-600">
                                    {getTotalReceived()} sản phẩm
                                </span>
                            </div>
                        </div>

                        {/* Receipt Note */}
                        <div className="mt-4">
                            <Textarea
                                aria-labelledby="Input"
                                label="Ghi chú phiếu nhập kho"
                                placeholder="Nhập ghi chú cho phiếu nhập kho..."
                                value={receiptNote}
                                onChange={(e) => setReceiptNote(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <Button
                                aria-labelledby="Input"
                                variant="bordered"
                                startContent={<ArrowLeft className="w-4 h-4"/>}
                                onClick={onSuccess}
                            >
                                Quay lại
                            </Button>
                            <Button
                                aria-labelledby="Input"
                                color="primary"
                                startContent={<Save className="w-4 h-4"/>}
                                onClick={handleSubmit}
                                isLoading={loading}
                                isDisabled={getTotalReceived() === 0}
                            >
                                Tạo Phiếu Nhập Kho
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
            <LocationSelectionModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                selectedItem={selectedItemIndex !== null ? orderItem[selectedItemIndex] : null}
                onConfirmLocation={handleConfirmLocation}
                warehouseId={currentOrder?.warehouse?.warehouseId || ""}
            />
        </div>
    );
};

export default CreateReceiptComponent;