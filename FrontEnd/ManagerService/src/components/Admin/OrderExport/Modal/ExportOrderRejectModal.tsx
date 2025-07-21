import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ExportOrder } from "@/Store/ExportOrderSlice.tsx";

interface ExportOrderRejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: ExportOrder | null;
}

export default function ExportOrderRejectModal({
                                                   isOpen,
                                                   onClose,
                                                   order
                                               }: ExportOrderRejectModalProps) {
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReject = async () => {
        if (!order || !rejectReason.trim()) return;

        setIsSubmitting(true);
        try {
            // API call to reject order
            console.log("Rejecting order:", order.exportOrderId, "Reason:", rejectReason);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            onClose();
            setRejectReason("");
        } catch (error) {
            console.error("Error rejecting order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setRejectReason("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:close-circle" className="text-2xl text-red-600" />
                        <div>
                            <h2 className="text-xl font-bold">Từ Chối Đơn Xuất Hàng</h2>
                            <p className="text-sm text-gray-500">
                                #{order?.exportOrderId.slice(-8)}
                            </p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Vui lòng nhập lý do từ chối đơn xuất hàng này:
                        </p>

                        <Textarea
                            label="Lý do từ chối"
                            placeholder="Nhập lý do từ chối đơn xuất hàng..."
                            value={rejectReason}
                            onValueChange={setRejectReason}
                            minRows={3}
                            maxRows={6}
                            isRequired
                            variant="bordered"
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        color="danger"
                        onPress={handleReject}
                        isLoading={isSubmitting}
                        isDisabled={!rejectReason.trim()}
                        startContent={!isSubmitting && <Icon icon="mdi:close" />}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Từ chối đơn"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}