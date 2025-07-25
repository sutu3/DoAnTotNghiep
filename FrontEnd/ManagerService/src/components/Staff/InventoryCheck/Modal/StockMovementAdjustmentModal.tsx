import  {useEffect, useState} from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Card,
    CardBody,
    Chip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { InventoryWarehouse } from "@/Store/InventoryWarehouseSlice.tsx";
import {StockMovementCreate} from "@/Store/StockMovementSlice.tsx";

interface StockMovementAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    inventoryItem: InventoryWarehouse | null;
    onSubmit: (adjustmentData: StockMovementCreate) => Promise<void>;
}



const StockMovementAdjustmentModal: React.FC<StockMovementAdjustmentModalProps> = ({
                                                                                       isOpen,
                                                                                       onClose,
                                                                                       inventoryItem,
                                                                                       onSubmit
                                                                                   }) => {
    const [newQuantity, setNewQuantity] = useState<number>(0);
    const [adjustmentReason, setAdjustmentReason] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const adjustmentReasons = [
        { key: "DAMAGED", label: "Hàng hỏng" },
        { key: "EXPIRED", label: "Hết hạn sử dụng" },
        { key: "LOST", label: "Mất hàng" },
        { key: "FOUND", label: "Tìm thấy hàng thừa" },
        { key: "RECOUNT", label: "Kiểm kê lại" },
        { key: "OTHER", label: "Lý do khác" }
    ];

    useEffect(() => {
        if (isOpen && inventoryItem) {
            setNewQuantity(inventoryItem.quantity);
            setAdjustmentReason("");
            setNote("");
        }
    }, [isOpen, inventoryItem]);

    const handleSubmit = async () => {
        if (!inventoryItem || newQuantity < 0 || !adjustmentReason.trim()) return;

        setIsSubmitting(true);
        try {
            const adjustmentData: StockMovementCreate = {
                inventoryWarehouseId: inventoryItem.inventoryWarehouseId,
                quantity: newQuantity,
                movementType: "ADJUSTMENT",
                note: `${adjustmentReason}: ${note}`.trim(),
                performedBy: "", // Sẽ được thay thế bằng user ID thực tế,
                product: inventoryItem?.productDetails?.productId,
                referenceOrderId: '',
                unitCost: 0
            };

            await onSubmit(adjustmentData);
            onClose();
        } catch (error) {
            console.error("Error submitting adjustment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const quantityDifference = inventoryItem ? newQuantity - inventoryItem.quantity : 0;
    const isValidAdjustment = newQuantity >= 0 && adjustmentReason.trim() !== "";

    const getReasonIcon = (reasonKey: string) => {
        switch (reasonKey) {
            case "DAMAGED": return "mdi:package-variant-remove";
            case "EXPIRED": return "mdi:calendar-alert";
            case "LOST": return "mdi:package-variant-minus";
            case "FOUND": return "mdi:package-variant-plus";
            case "RECOUNT": return "mdi:clipboard-check";
            case "OTHER": return "mdi:help-circle";
            default: return "mdi:circle";
        }
    };

    return (
        <Modal

            size="2xl"
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={!isSubmitting}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Icon icon="mdi:pencil-circle" className="text-2xl text-orange-600" />
                    <div>
                        <h3 className="text-xl font-semibold">Điều Chỉnh Tồn Kho</h3>
                        <p className="text-sm text-gray-500">
                            {inventoryItem?.productDetails?.productName} - {inventoryItem?.binDetails?.binCode}
                        </p>
                    </div>
                </ModalHeader>

                <ModalBody>
                    {inventoryItem && (
                        <div className="space-y-6">
                            {/* Current Info Card */}
                            <Card>
                                <CardBody className="bg-gray-50 dark:bg-gray-800">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Sản phẩm:</span>
                                            <p className="font-medium">{inventoryItem.productDetails?.productName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Vị trí:</span>
                                            <p className="font-medium">{inventoryItem.binDetails?.binCode}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Số lượng hiện tại:</span>
                                            <p className="font-medium text-blue-600">{inventoryItem.quantity}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Adjustment Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        label="Số lượng mới"
                                        placeholder="Nhập số lượng sau điều chỉnh"
                                        value={newQuantity.toString()}
                                        onValueChange={(value) => setNewQuantity(parseInt(value) || 0)}
                                        min={0}
                                        variant="bordered"
                                        startContent={<Icon icon="mdi:package-variant" className="text-gray-400" />}
                                        isRequired
                                    />

                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Thay đổi</p>
                                            <Chip
                                                color={quantityDifference > 0 ? "success" : quantityDifference < 0 ? "danger" : "default"}
                                                variant="flat"
                                                size="lg"
                                                startContent={
                                                    <Icon
                                                        icon={
                                                            quantityDifference > 0 ? "mdi:arrow-up" :
                                                                quantityDifference < 0 ? "mdi:arrow-down" :
                                                                    "mdi:minus"
                                                        }
                                                    />
                                                }
                                            >
                                                {quantityDifference > 0 ? '+' : ''}{quantityDifference}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Lý do điều chỉnh *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {adjustmentReasons.map((reason) => (
                                            <div key={reason.key} className="relative group">
                                                <Button
                                                    variant={adjustmentReason === reason.key ? "solid" : "bordered"}
                                                    color={adjustmentReason === reason.key ? "primary" : "default"}
                                                    className="w-full h-auto p-4 justify-start"
                                                    startContent={<Icon icon={getReasonIcon(reason.key)} className="text-lg" />}
                                                    onClick={() => setAdjustmentReason(reason.key)}
                                                >
                                                    <span className="text-sm font-medium">{reason.label}</span>
                                                </Button>

                                                {/* Hover Chip */}
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                    <Chip
                                                        size="sm"
                                                        color="primary"
                                                        variant="shadow"
                                                        startContent={<Icon icon={getReasonIcon(reason.key)} />}
                                                    >
                                                        {reason.label}
                                                    </Chip>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Textarea
                                    label="Ghi chú chi tiết"
                                    placeholder="Nhập mô tả chi tiết về lý do điều chỉnh..."
                                    value={note}
                                    onValueChange={setNote}
                                    minRows={3}
                                    maxRows={5}
                                    variant="bordered"
                                />
                            </div>

                            {/* Warning for significant changes */}
                            {Math.abs(quantityDifference) > inventoryItem.quantity * 0.2 && (
                                <Card>
                                    <CardBody className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:alert" className="text-yellow-600" />
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                <strong>Cảnh báo:</strong> Thay đổi lớn về số lượng ({'>'}{Math.round(Math.abs(quantityDifference) / inventoryItem.quantity * 100)}%).
                                                Vui lòng kiểm tra kỹ và ghi rõ lý do.
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="light"
                        onPress={onClose}
                        isDisabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="warning"
                        onPress={handleSubmit}
                        isLoading={isSubmitting}
                        isDisabled={!isValidAdjustment}
                        startContent={!isSubmitting && <Icon icon="mdi:content-save" />}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận điều chỉnh"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default StockMovementAdjustmentModal;