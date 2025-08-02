import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    Chip,
    Avatar,
    Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskUser: any;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, taskUser }) => {
    if (!taskUser) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'In_Progress': return 'primary';
            case 'Complete': return 'success';
            case 'Cancel': return 'danger';
            default: return 'default';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Low': return 'success';
            case 'Medium': return 'warning';
            case 'High': return 'danger';
            default: return 'default';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                        <Icon icon="mdi:clipboard-text" className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Chi Tiết Nhiệm Vụ</h3>
                        <p className="text-sm text-gray-600">{taskUser.task.taskType.taskName}</p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Task Information */}
                        <Card>
                            <CardBody className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">Thông Tin Nhiệm Vụ</h4>
                                    <div className="flex gap-2">
                                        <Chip
                                            color={getLevelColor(taskUser.task.level)}
                                            variant="flat"
                                            size="sm"
                                        >
                                            Mức độ: {taskUser.task.level}
                                        </Chip>
                                        <Chip
                                            color={getStatusColor(taskUser.status)}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {taskUser.status}
                                        </Chip>
                                    </div>
                                </div>

                                <Divider />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Loại nhiệm vụ:</p>
                                        <p className="font-medium">{taskUser.task.taskType.taskName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Mã nhiệm vụ:</p>
                                        <p className="font-mono text-sm">{taskUser.task.taskId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Hạn hoàn thành:</p>
                                        <p className="font-medium">
                                            {taskUser.completeAt ?
                                                new Date(taskUser.completeAt).toLocaleString('vi-VN') :
                                                'Chưa xác định'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Kho:</p>
                                        <p className="font-medium">
                                            {taskUser.task.warehouses?.warehouseName || 'Không xác định'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Mô tả:</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm">{taskUser.task.description}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Ghi chú:</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm">{taskUser.note || 'Không có ghi chú'}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* User Information */}
                        <Card>
                            <CardBody>
                                <h4 className="font-semibold text-gray-800 mb-4">Thông Tin Người Thực Hiện</h4>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={taskUser.user.urlImage}
                                        name={taskUser.user.fullName}
                                        size="lg"
                                    />
                                    <div>
                                        <p className="font-semibold">{taskUser.user.fullName}</p>
                                        <p className="text-sm text-gray-600">@{taskUser.user.userName}</p>
                                        <p className="text-sm text-gray-600">{taskUser.user.email}</p>
                                        <p className="text-sm text-gray-600">{taskUser.user.phoneNumber}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardBody>
                                <h4 className="font-semibold text-gray-800 mb-4">Lịch Sử</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Nhiệm vụ được tạo</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(taskUser.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    {taskUser.updatedAt !== taskUser.createdAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Cập nhật lần cuối</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(taskUser.updatedAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                    >
                        Đóng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskDetailModal;