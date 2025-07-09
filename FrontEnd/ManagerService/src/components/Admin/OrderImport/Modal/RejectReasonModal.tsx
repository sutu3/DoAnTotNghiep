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

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    rejectReason: string;
    setRejectReason: (reason: string) => void;
    onConfirm: () => void;
}

export default function RejectReasonModal({
                                              isOpen,
                                              onClose,
                                              rejectReason,
                                              setRejectReason,
                                              onConfirm
                                          }: RejectReasonModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:close-circle" className="text-xl text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Lý Do Từ Chối Đơn Hàng</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vui lòng nhập lý do từ chối
                        </p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Textarea
                        label="Lý do từ chối"
                        placeholder="Nhập lý do từ chối đơn hàng..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        minRows={3}
                        maxRows={6}
                        variant="bordered"
                        classNames={{
                            input: "resize-none",
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        startContent={<Icon icon="mdi:close" />}
                        onClick={onConfirm}
                        isDisabled={!rejectReason.trim()}
                    >
                        Xác nhận từ chối
                    </Button>
                    <Button variant="light" onClick={onClose}>
                        Hủy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}