import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Card,
    CardBody,
    Chip,
    Textarea,
    Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useWarehouseDeliveryStore } from "@/zustand/warehouseDeliveryStore.tsx";
import {ExportOrder, ExportOrderItem} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface DeliveryItemModalProps {
    exportOrder: ExportOrder|undefined;
    isOpen: boolean;
    onClose: () => void;
    exportItem: ExportOrderItem | null;
}

export default function DeliveryItemModal({exportOrder, isOpen, onClose, exportItem }: DeliveryItemModalProps) {
    const { addItem } = useWarehouseDeliveryStore();
    const [deliveredQuantity, setDeliveredQuantity] = useState(0);
    const [note, setNote] = useState("");

    useEffect(() => {
        if (exportItem && isOpen) {
            setDeliveredQuantity(exportItem.quantity || 0);
            setNote("");
        }
    }, [exportItem, isOpen]);

    const handleAddToDelivery = () => {
        if (deliveredQuantity <= 0) return;
        if(exportItem != null){
            const deliveryItem: ExportOrderItem = {
                exportItemId: exportItem?.exportItemId,
                product: exportItem?.product,
                customer: exportOrder?.customer,
                quantity: exportItem?.quantity,
                realityQuantity: deliveredQuantity,
                unitPrice: exportItem?.unitPrice,
                unit: exportItem?.unit,
                bin: exportItem?.bin, // Sử dụng bin từ export order gốc
                note: note,
                batchNumber: exportItem?.batchNumber,
            };
            addItem(deliveryItem);
            onClose();
        }
    };

    return (
        <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Icon icon="mdi:truck-delivery" className="text-2xl text-orange-600" />
                    <div>
                        <h3 className="text-xl font-semibold">Thêm Vào Phiếu Xuất</h3>
                        <p className="text-sm text-gray-500">{exportItem?.product?.productName}</p>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">
                        {/* Thông tin sản phẩm và vị trí đã được duyệt */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardBody className="p-4">
                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Icon icon="mdi:information" />
                                    Thông Tin Đã Duyệt
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Sản phẩm:</p>
                                        <p className="font-medium">{exportItem?.product?.productName}</p>
                                        <p className="text-xs text-gray-500">SKU: {exportItem?.product?.sku}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Vị trí bin đã chỉ định:</p>
                                        <Chip color="primary" variant="flat" className="mt-1">
                                            {exportItem?.bin?.binCode || 'Chưa chỉ định'}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số lượng yêu cầu:</p>
                                        <p className="font-semibold text-blue-600">
                                            {exportItem?.quantity} {exportItem?.unit?.unitName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Đơn giá:</p>
                                        <p className="font-semibold text-green-600">
                                            {exportItem?.unitPrice?.toLocaleString('vi-VN')} ₫
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Divider />

                        {/* Form nhập thông tin xuất thực tế */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Icon icon="mdi:clipboard-edit" />
                                Thông Tin Xuất Thực Tế
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    label="Số lượng xuất thực tế"
                                    value={deliveredQuantity.toString()}
                                    onValueChange={(value) => setDeliveredQuantity(parseFloat(value) || 0)}
                                    max={exportItem?.quantity}
                                    startContent={<Icon icon="mdi:package-variant" />}
                                    step="0.001"
                                    description={`Tối đa: ${exportItem?.quantity} ${exportItem?.unit?.unitName}`}
                                />

                                <Input
                                    label="Đơn vị"
                                    value={exportItem?.unit?.unitName || ""}
                                    isReadOnly
                                    startContent={<Icon icon="mdi:scale" />}
                                />
                            </div>

                            <Textarea
                                label="Ghi chú xuất kho"
                                value={note}
                                onValueChange={setNote}
                                placeholder="Nhập ghi chú cho việc xuất kho này..."
                                minRows={3}
                            />
                        </div>

                        {/* Tóm tắt thông tin */}
                        <Card className="bg-orange-50 border-orange-200">
                            <CardBody className="p-4">
                                <h4 className="font-semibold text-orange-800 mb-2">Tóm Tắt Xuất Kho</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Vị trí xuất:</span>
                                        <Chip color="warning" variant="flat" size="sm">
                                            {exportItem?.bin?.binCode || 'Chưa chỉ định'}
                                        </Chip>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Số lượng xuất:</span>
                                        <span className="font-semibold">
                                            {deliveredQuantity} {exportItem?.unit?.unitName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Giá trị xuất:</span>
                                        <span className="font-bold text-orange-600">
                                            {(deliveredQuantity * (exportItem?.unitPrice || 0)).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Hủy
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleAddToDelivery}
                        isDisabled={deliveredQuantity <= 0 || deliveredQuantity > (exportItem?.quantity || 0)}
                        startContent={<Icon icon="mdi:plus" />}
                    >
                        Thêm vào phiếu xuất
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}