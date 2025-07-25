// components/Staff/Tasks/TaskDetailModal.tsx
import React, {useEffect} from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from '@heroui/react';
import { Package, Clock, User, MapPin, Calendar, AlertCircle } from 'lucide-react';
import {Task} from "@/Store/TaskSlice.tsx";
import {TaskUserSelector} from "@/Store/Selector.tsx";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllTaskUser} from "@/Store/Thunk/TaskUserThunk.tsx";
import {TaskUser} from "@/Store/TaskUserSlice.tsx";

interface TaskDetailModalProps {
    taskId:string;
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onUpdateStatus: (taskId: string, status: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({taskId,
                                                             isOpen,
                                                             onClose,
                                                             task,
                                                             onUpdateStatus
                                                         }) => {
    if (!task) return null;

    const handleStatusUpdate = (status: string) => {
        onUpdateStatus(task.taskId, status);
        onClose();
    };
    const dispatch=useDispatch();
    const TaskUsers:TaskUser[]=useSelector(TaskUserSelector);
    useEffect(() => {
        const fetch=async()=>{
                await(dispatch as any)(MiddleGetAllTaskUser(taskId));
        }
        fetch()

    }, [taskId]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {task?.taskType?.description || 'Chi tiết nhiệm vụ'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                ID: {task.taskId?.substring(0, 8)}...
                            </p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-6">
                        {/* Status & Priority */}
                        <div className="flex gap-4">
                            <Chip
                                color={task.status === 'Completed' ? 'success' :
                                    task.status === 'In_Progress' ? 'primary' : 'warning'}
                                variant="flat"
                                startContent={<Clock className="w-3 h-3" />}
                            >
                                {task.status === 'Completed' ? 'Hoàn thành' :
                                    task.status === 'In_Progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                            </Chip>

                            <Chip
                                color={task.level === 'high' ? 'danger' :
                                    task.level === 'medium' ? 'warning' : 'success'}
                                variant="flat"
                                startContent={<AlertCircle className="w-3 h-3" />}
                            >
                                Ưu tiên {task.level === 'high' ? 'cao' :
                                task.level === 'medium' ? 'trung bình' : 'thấp'}
                            </Chip>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Mô tả nhiệm vụ
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {task.description || 'Không có mô tả chi tiết'}
                            </p>
                        </div>

                        <Divider />

                        {/* Task Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Kho</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {task?.warehouses?.warehouseName || 'Chưa xác định'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Hạn hoàn thành</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {task.completeAt ?
                                            new Date(task.completeAt).toLocaleDateString('vi-VN') :
                                            'Chưa có hạn'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nhân viên</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {task.taskUsers?.length || 0} người được phân công
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Users */}
                        {task.taskUsers && task.taskUsers.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                                    Nhân viên được phân công
                                </h3>
                                <div className="space-y-2">
                                    {TaskUsers?.map((task: TaskUser, index: number) => (
                                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">
                                                {task.user?.fullName || task.user?.userName || 'Nhân viên'}
                                            </span>
                                            <span className="font-medium text-gray-800 dark:text-white">
                                                {task.note}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

                    {task.status !== 'Completed' && (
                        <>
                            {task.status === 'Pending' && (
                                <Button
                                    color="primary"
                                    onPress={() => handleStatusUpdate('In_Progress')}
                                >
                                    Bắt đầu thực hiện
                                </Button>
                            )}
                            {task.status === 'In_Progress' && (
                                <Button
                                    color="success"
                                    onPress={() => handleStatusUpdate('Completed')}
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