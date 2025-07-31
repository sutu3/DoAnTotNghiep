"use client";

import { useState, useEffect } from "react";
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
    Input,
    Textarea,
    Avatar,
    Chip
} from "@heroui/react";
import {Package, Save, ArrowLeft, MapPin} from "lucide-react";
import WarehouseReceiptSlice, {
    ReceiptItemCreate,
    ReceiptItemResponse,
    WarehouseReceiptResponse
} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ReceiptItemSelector, StacksSelector} from "@/Store/Selector.tsx";
import {syncWithBackend, UpdateReceiptComplete} from "@/pages/ExecuteImport/Store/Thunk/WarehousReceipteThunk.tsx";
import {MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {Bin, StackType} from "@/Store/StackSlice.tsx";
import LocationSelectionModal from "@/components/Staff/ExecuteImport/Modal/LocationSelectionModal.tsx";
import OrderImportSlice from "@/pages/ExecuteImport/Store/ImportOrder.tsx";

interface UpdateReceiptComponentProps {
    receipt: WarehouseReceiptResponse;
    onSuccess: () => void;
}

const UpdateReceiptComponent: React.FC<UpdateReceiptComponentProps> = ({
                                                                           receipt,
                                                                           onSuccess
                                                                       }) => {
    const [receiptNote, setReceiptNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [changedItems, setChangedItems] = useState<Set<ReceiptItemCreate>>(new Set());
    const receiptItems:ReceiptItemResponse[]=useSelector(ReceiptItemSelector);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const stacksBinData = useSelector(StacksSelector);
    console.log(receipt);
    const dispatch=useDispatch();
    useEffect(() => {
        if (receipt) {
            initializeReceiptData();
        }
        if (receipt.importOrder?.warehouse?.warehouseId) {
            (dispatch as any)(MiddleGetAllStackList(receipt.importOrder.warehouse.warehouseId));
        }
    }, [receipt]);
    useEffect(() => {
        dispatch(OrderImportSlice.actions.setOrderImportList([]))
    }, []);
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
            const updatedItems = receiptItems.map((item, index) =>
                index === selectedItemIndex
                    ? {
                        ...item,
                        binLocation: selectedBinData?.binId || "",
                        binDetails: selectedBinData
                    }
                    : item
            );

            dispatch(WarehouseReceiptSlice.actions.setAddReceiptList(updatedItems));

            // Add to changed items
            const itemId = receiptItems[selectedItemIndex].receiptItemId;
            setChangedItems((prev: any) => new Set([...prev, itemId]));

            setIsLocationModalOpen(false);
            setSelectedItemIndex(null);
        }
    };
    const initializeReceiptData = () => {
        setReceiptNote(receipt.note || "");
        setChangedItems(new Set());
        dispatch(WarehouseReceiptSlice.actions.setAddReceiptList(receipt?.receiptItems));
    };

    const handleItemChange = async (index: number, field: string, value: any) => {
        const updatedItems = receiptItems.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        dispatch(WarehouseReceiptSlice.actions.setAddReceiptList(updatedItems));

        // Add item to changed list
        const itemId = receiptItems[index].receiptItemId;
        setChangedItems((prev:any) => new Set([...prev, itemId]));


    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Lọc chỉ những items đã thay đổi
            const changedItemsData = receiptItems.filter(item =>
                changedItems.has(item.receiptItemId)
            );

            // Xử lý tuần tự từng item đã thay đổi
            for (const item of changedItemsData) {
                const updateField: ReceiptItemCreate = {
                    importItemId: item.importItemId,
                    receivedQuantity: item.receivedQuantity,
                    binLocation: item.binLocation,
                    note: item.note,
                };

                await (dispatch as any)(syncWithBackend({
                    receiptId: receipt?.receiptId,
                    receiptItemId: item.receiptItemId,
                    request: updateField
                }));
            }

            // Reset changed items sau khi save thành công
            setChangedItems(new Set());

            onSuccess();
        } catch (error) {
            console.error("Error updating receipt:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteReceipt = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(UpdateReceiptComplete({receiptId:receipt?.receiptId}))
            onSuccess();
        } catch (error) {
            console.error("Error completing receipt:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalReceived = () => {
        return receiptItems.reduce((total:number, item:ReceiptItemResponse) => total + item.receivedQuantity, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Cập Nhật Phiếu Nhập Kho
                            </h2>
                            <p className="text-sm text-gray-500">
                                Mã phiếu: #{receipt.receiptId?.slice(-8)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Chip color="warning" variant="flat" size="sm">
                                Đang cập nhật
                            </Chip>
                            <span className="text-sm text-yellow-800">
                                Phiếu nhập kho đang được chỉnh sửa. Bạn có thể cập nhật thông tin sản phẩm và hoàn thiện phiếu.
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Receipt Items */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Danh Sách Sản Phẩm
                        </h3>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table>
                        <TableHeader>
                            <TableColumn>SẢN PHẨM</TableColumn>
                            <TableColumn>SL YÊU CẦU</TableColumn>
                            <TableColumn>SL THỰC NHẬN</TableColumn>
                            <TableColumn>VỊ TRÍ</TableColumn>
                            <TableColumn>GHI CHÚ</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {receiptItems.map((item:ReceiptItemResponse, index:number) => (
                                <TableRow
                                    key={index}
                                    className={changedItems.has(item.receiptItemId) ? "bg-yellow-50 border-l-4 border-l-yellow-400" : ""}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={item?.importItem?.product.urlImageProduct}
                                                size="sm"
                                                fallback={<Package className="w-4 h-4" />}
                                            />
                                            <div>
                                                <p className="font-medium">{item?.importItem?.product.productName}</p>
                                                <p className="text-xs text-gray-500">{item?.importItem?.unit.unitName}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-blue-600">
                                            {item?.importItem?.requestQuantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            disabled={receipt.status == 'COMPLETED'}
                                            type="number"
                                            size="sm"
                                            value={item.receivedQuantity.toString()}
                                            onChange={(e) => handleItemChange(
                                                index,
                                                'receivedQuantity',
                                                parseInt(e.target.value) || 0
                                            )}
                                            max={item?.importItem?.requestQuantity}
                                            className="w-24"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            disabled={receipt.status == 'COMPLETED'}
                                            variant="bordered"
                                            onClick={() => handleOpenLocationModal(index)}
                                            startContent={<MapPin className="w-4 h-4" />}
                                            className="w-full justify-start h-10"
                                            color={item.binLocation ? "success" : "default"}
                                            size="sm"
                                        >
                                            {item.binLocation
                                                ? `${item.binLocation}`
                                                : 'Chọn vị trí'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            disabled={receipt.status == 'COMPLETED'}
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
                            disabled={receipt.status == 'COMPLETED'}
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
                            variant="bordered"
                            startContent={<ArrowLeft className="w-4 h-4" />}
                            onClick={onSuccess}
                        >
                            Quay lại
                        </Button>
                        {receipt.status !== 'COMPLETED' && (
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<Save className="w-4 h-4" />}
                            onClick={handleSubmit}

                            isLoading={loading}
                        >
                            Lưu thay đổi
                        </Button>)
                        }
                        {receipt.status !== 'COMPLETED' && (
                            <Button
                                color="success"
                                startContent={<Package className="w-4 h-4" />}
                                onClick={handleCompleteReceipt}
                                isLoading={loading}
                                isDisabled={getTotalReceived() === 0}
                            >
                                Hoàn thành phiếu
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
            <LocationSelectionModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                selectedItem={selectedItemIndex !== null ? receiptItems[selectedItemIndex] : null}
                onConfirmLocation={handleConfirmLocation}
                warehouseId={receipt.importOrder?.warehouse?.warehouseId || ""}
            />
        </div>
    );
};

export default UpdateReceiptComponent;


