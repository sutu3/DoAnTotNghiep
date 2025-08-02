import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Card,
    CardBody
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface CancelTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskUser: any;
    onConfirm: (reason: string) => void;
}

const CancelTaskModal: React.FC<CancelTaskModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             taskUser,
                                                             onConfirm
                                                         }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!reason.trim()) {
            alert('Vui lòng nhập lý do hủy nhiệm vụ');
            return;
        }

        setLoading(true);
        try {
            onConfirm(reason);
            setReason('');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!taskUser) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="lg"
            isDismissable={!loading}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <div className="bg-red-100 rounded-lg p-2">
                        <Icon icon="mdi:alert-circle" className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-700">Hủy Nhiệm Vụ</h3>
                        <p className="text-sm text-gray-600">Xác nhận hủy nhiệm vụ này</p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        {/* Task Info */}
                        <Card className="bg-red-50 border border-red-200">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:clipboard-text" className="text-red-600" />
                                    <div>
                                        <p className="font-semibold text-red-800">
                                            {taskUser.task.taskType.taskName}
                                        </p>
                                        <p className="text-sm text-red-600">
                                            {taskUser.task.description}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon icon="mdi:warning" className="text-yellow-600 text-xl mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Lưu ý quan trọng:</p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Việc hủy nhiệm vụ sẽ không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reason Input */}
                        <div>
                            <Textarea
                                label="Lý do hủy nhiệm vụ"
                                placeholder="Nhập lý do chi tiết tại sao bạn muốn hủy nhiệm vụ này..."
                                value={reason}
                                onValueChange={setReason}
                                variant="bordered"
                                minRows={4}
                                maxRows={6}
                                isRequired
                                description="Lý do này sẽ được lưu lại để theo dõi và báo cáo"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        onPress={handleClose}
                        isDisabled={loading}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        color="danger"
                        onPress={handleConfirm}
                        isLoading={loading}
                        startContent={!loading && <Icon icon="mdi:close-circle" />}
                    >
                        Xác nhận hủy nhiệm vụ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancelTaskModal;