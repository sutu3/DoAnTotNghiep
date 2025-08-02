import React, { useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Divider,
    Card,
    CardBody,
    Avatar,
    Link,
    Image
} from '@heroui/react';
import { Package, Clock, User, MapPin, Calendar, AlertCircle, ExternalLink, ImageIcon } from 'lucide-react';
import { Task } from "@/pages/TaskType/Component/Store/TaskSlice.tsx";
import { TaskUserSelector } from "@/Store/Selector.tsx";
import { useDispatch, useSelector } from "react-redux";
import { MiddleGetAllTaskUser } from "@/pages/TaskType/Component/Store/TaskUserThunk.tsx";
import { TaskUser } from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";

interface TaskDetailModalProps {
    taskId: string;
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onUpdateStatus: (taskId: string, status: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
                                                             taskId,
                                                             isOpen,
                                                             onClose,
                                                             task,
                                                             onUpdateStatus
                                                         }) => {
    if (!task) return null;

    const dispatch = useDispatch();
    const TaskUsers: TaskUser[] = useSelector(TaskUserSelector);

    useEffect(() => {
        const fetch = async () => {
            await (dispatch as any)(MiddleGetAllTaskUser(taskId));
        }
        fetch();
    }, [taskId]);

    const handleStatusUpdate = (status: string) => {
        onUpdateStatus(task.taskId, status);
        onClose();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Complete': return 'success';
            case 'In_Progress': return 'primary';
            case 'Pending': return 'warning';
            case 'Cancel': return 'danger';
            default: return 'default';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Complete': return 'Hoàn thành';
            case 'In_Progress': return 'Đang thực hiện';
            case 'Pending': return 'Chờ xử lý';
            case 'Cancel': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
                body: "py-6",
                header: "border-b border-gray-200"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 shadow-lg">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {task?.taskType?.taskName || 'Chi tiết nhiệm vụ'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                ID: {task.taskId?.substring(0, 8)}... | Yêu cầu bằng chứng: {task.requiresEvidence ? 'Có' : 'Không'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Chip
                                color={getLevelColor(task.level)}
                                variant="flat"
                                startContent={<AlertCircle className="w-3 h-3" />}
                            >
                                Mức độ: {task.level}
                            </Chip>
                            <Chip
                                color={getStatusColor(task.status)}
                                variant="flat"
                                startContent={<Clock className="w-3 h-3" />}
                            >
                                {getStatusText(task.status)}
                            </Chip>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-6">
                        {/* Task Information */}
                        <Card className="shadow-sm">
                            <CardBody className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Thông Tin Nhiệm Vụ
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Loại nhiệm vụ</p>
                                            <p className="font-medium text-gray-800">{task?.taskType?.taskName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Mô tả loại nhiệm vụ</p>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                {task?.taskType?.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Kho thực hiện</p>
                                                <p className="font-medium text-gray-800">
                                                    {task?.warehouses?.warehouseName || 'Chưa xác định'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Hạn hoàn thành</p>
                                                <p className="font-medium text-gray-800">
                                                    {task.completeAt ?
                                                        new Date(task.completeAt).toLocaleDateString('vi-VN') :
                                                        'Chưa có hạn'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="my-4" />

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Mô tả chi tiết nhiệm vụ</p>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm text-gray-700">{task.description || 'Không có mô tả chi tiết'}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Assigned Users Details */}
                        {TaskUsers && TaskUsers.length > 0 && (
                            <Card className="shadow-sm">
                                <CardBody className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Nhân Viên Được Phân Công ({TaskUsers.length})
                                    </h3>

                                    <div className="space-y-4">
                                        {TaskUsers.map((taskUser: TaskUser, index: number) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-4">
                                                    {/* User Avatar & Info */}
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <Avatar
                                                            src={taskUser.user?.urlImage}
                                                            name={taskUser.user?.fullName?.charAt(0)}
                                                            size="lg"
                                                            className="flex-shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800">
                                                                {taskUser.user?.fullName || taskUser.user?.userName || 'Nhân viên'}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">@{taskUser.user?.userName}</p>
                                                            <p className="text-sm text-gray-500">{taskUser.user?.email}</p>
                                                            <p className="text-sm text-gray-500">{taskUser.user?.phoneNumber}</p>
                                                        </div>
                                                    </div>

                                                    {/* Task Status & Details */}
                                                    <div className="flex-shrink-0 text-right">
                                                        <Chip
                                                            color={getStatusColor(taskUser.status)}
                                                            variant="flat"
                                                            size="sm"
                                                            className="mb-2"
                                                        >
                                                            {getStatusText(taskUser.status)}
                                                        </Chip>

                                                        {taskUser.completeAt && (
                                                            <p className="text-xs text-gray-500">
                                                                Hoàn thành: {new Date(taskUser.completeAt).toLocaleString('vi-VN')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Task Note */}
                                                {taskUser.note && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-sm text-gray-600 mb-1">Ghi chú:</p>
                                                        <p className="text-sm bg-gray-50 p-2 rounded">{taskUser.note}</p>
                                                    </div>
                                                )}

                                                {/* Evidence Images - Hiển thị khi status là Complete */}
                                                {taskUser.status === 'Complete' && taskUser.evidenceImages && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ImageIcon className="w-4 h-4 text-green-600" />
                                                            <p className="text-sm font-medium text-green-700">Ảnh bằng chứng hoàn thành:</p>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <Image
                                                                    src={taskUser.evidenceImages}
                                                                    alt="Evidence"
                                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg cursor-pointer" />
                                                            </div>

                                                            <div className="flex-1">
                                                                <Link
                                                                    href={taskUser.evidenceImages}
                                                                    target="_blank"
                                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Xem ảnh đầy đủ
                                                                </Link>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Nhấn để mở ảnh trong tab mới
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Timeline */}
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span>Tạo: {new Date(taskUser.createdAt).toLocaleString('vi-VN')}</span>
                                                        {taskUser.updatedAt !== taskUser.createdAt && (
                                                            <span>Cập nhật: {new Date(taskUser.updatedAt).toLocaleString('vi-VN')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </ModalBody>

                <ModalFooter className="border-t border-gray-200">
                    <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                    >
                        Đóng
                    </Button>

                    {task.status !== 'Completed' && (
                        <>
                            {task.status === 'Pending' && (
                                <Button
                                    color="primary"
                                    onPress={() => handleStatusUpdate('In_Progress')}
                                    startContent={<Clock className="w-4 h-4" />}
                                >
                                    Bắt đầu thực hiện
                                </Button>
                            )}
                            {task.status === 'In_Progress' && (
                                <Button
                                    color="success"
                                    onPress={() => handleStatusUpdate('Complete')}
                                    startContent={<Package className="w-4 h-4" />}
                                >
                                    Hoàn thành
                                </Button>
                            )}
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskDetailModal;