import React from 'react';
import { Card, CardBody, CardHeader, Chip, Avatar, AvatarGroup, Divider } from '@heroui/react';
import { Package, Calendar, AlertTriangle, Users } from 'lucide-react';
import {UserData} from "@/Store/UserSlice.tsx";
import {TaskType} from "@/Store/TaskTypeSlice.tsx";
import {TaskUserAssignment} from "@/Store/TaskUserSlice.tsx";

interface TaskPreviewCardProps {
    formData: any;
    assignedUsers: TaskUserAssignment[];
    users: UserData[];
    taskTypes: TaskType[];
}

const TaskPreviewCard: React.FC<TaskPreviewCardProps> = ({
                                                             formData,
                                                             assignedUsers,
                                                             users,
                                                             taskTypes
                                                         }) => {
    const selectedTaskType = taskTypes?.find(t => t.taskName === formData.taskType);
    const selectedUsers = users?.filter((u:UserData) => assignedUsers.includes(u?.userId)) || [];

    const getPriorityColor = (level: string) => {
        switch (level) {
            case 'Hight': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'default';
        }
    };

    return (
        <div className="sticky top-6 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2">
                            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Xem trước nhiệm vụ
                        </h3>
                    </div>
                </CardHeader>
                <CardBody className="space-y-4">
                    {/* Task Type */}
                    <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loại nhiệm vụ</p>
                            <p className="font-medium text-gray-800 dark:text-white">
                                {formData.taskType || 'Chưa chọn'}
                            </p>
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mức độ ưu tiên</p>
                            <Chip
                                color={getPriorityColor(formData.level)}
                                variant="flat"
                                size="sm"
                            >
                                {formData.level === 'Hight' ? 'Cao' :
                                    formData.level === 'Medium' ? 'Trung bình' : 'Thấp'}
                            </Chip>
                        </div>
                    </div>

                    {/* Deadline */}
                    {formData.completeAt && (
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Hạn hoàn thành</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {new Date(formData.completeAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {formData.description && (
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Mô tả</p>
                            <p className="text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                {formData.description}
                            </p>
                        </div>
                    )}

                    <Divider />

                    {/* Assigned Users */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Nhân viên được phân công ({assignedUsers.length})
                            </p>
                        </div>

                        {selectedUsers.length > 0 ? (
                            <div className="space-y-2">
                                <AvatarGroup max={3} className="justify-start">
                                    {selectedUsers.map((user: any) => (
                                        <Avatar
                                            key={user.userId}
                                            src={user.urlImage}
                                            name={user.userName?.charAt(0).toUpperCase()}
                                            size="sm"
                                        />
                                    ))}
                                </AvatarGroup>

                                <div className="space-y-1 mt-3">
                                    {selectedUsers.slice(0, 3).map((user: any) => (
                                        <div key={user.userId} className="text-xs text-gray-600 dark:text-gray-400">
                                            • {user.fullName || user.userName}
                                        </div>
                                    ))}
                                    {selectedUsers.length > 3 && (
                                        <div className="text-xs text-gray-500">
                                            +{selectedUsers.length - 3} người khác
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">
                                Chưa phân công nhân viên nào
                            </p>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Summary Stats */}
            <Card className="shadow-lg">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Tóm tắt
                    </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Loại nhiệm vụ:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            {formData.taskType ? '✓' : '✗'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Mô tả:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            {formData.description ? '✓' : '✗'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Kho:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            {formData.warehouses ? '✓' : '✗'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Nhân viên:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            {assignedUsers.length > 0 ? '✓' : '✗'}
                        </span>
                    </div>

                    <Divider />

                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Hoàn thành tất cả để tạo nhiệm vụ
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default TaskPreviewCard;