import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Input, Checkbox, Avatar, Chip, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Users, Search, User, Edit, Calendar, FileText } from 'lucide-react';
import {TaskUserAssignment} from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";


interface TaskAssignmentFormProps {
    users: any[];
    assignedUsers: TaskUserAssignment[];
    onUserAssignment: (assignments: TaskUserAssignment[]) => void;
    currentStep: number;
    onStepChange: (step: number) => void;
    warehouseId: string;
}

const TaskAssignmentForm: React.FC<TaskAssignmentFormProps> = ({
                                                                   users,
                                                                   assignedUsers,
                                                                   onUserAssignment,
                                                                   currentStep,
                                                                   warehouseId
                                                               }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<TaskUserAssignment | null>(null);

    useEffect(() => {
        const filtered = users?.filter((user: any) => {
            const matchesWarehouse = !warehouseId || user.warehouses?.warehouseId === warehouseId;
            const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesWarehouse && matchesSearch;
        }) || [];

        setFilteredUsers(filtered);
    }, [users, warehouseId, searchTerm]);

    const handleUserToggle = (userId: string) => {
        const isAssigned = assignedUsers.some(assignment => assignment.user === userId);

        if (isAssigned) {
            // Remove user
            const newAssignments = assignedUsers.filter(assignment => assignment.user !== userId);
            onUserAssignment(newAssignments);
        } else {
            const newAssignment: TaskUserAssignment = {
                user:userId,
                note: '',
                completeAt: ''
            };
            onUserAssignment([...assignedUsers, newAssignment]);
        }
    };

    const handleEditUserAssignment = (userId: string) => {
        const assignment = assignedUsers.find(a => a.user === userId);
        if (assignment) {
            setEditingUser(assignment);
            setIsEditModalOpen(true);
        }
    };

    const handleSaveUserAssignment = (updatedAssignment: TaskUserAssignment) => {
        const newAssignments = assignedUsers.map(assignment =>
            assignment.user === updatedAssignment.user ? updatedAssignment : assignment
        );
        onUserAssignment(newAssignments);
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleSelectAll = () => {
        if (assignedUsers.length === filteredUsers.length) {
            onUserAssignment([]);
        } else {
            const newAssignments = filteredUsers.map(user => ({
                user: user.userId,
                note: '',
                completeAt: ''
            }));
            onUserAssignment(newAssignments);
        }
    };

    const isUserAssigned = (userId: string) => {
        return assignedUsers.some(assignment => assignment.user === userId);
    };

    const getUserAssignment = (userId: string) => {
        return assignedUsers.find(assignment => assignment.user === userId);
    };

    return (
        <>
            <Card className={`shadow-lg transition-all ${currentStep === 2 ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Bước 2: Phân công nhân viên
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Chọn nhân viên và thiết lập thông tin chi tiết cho từng người
                            </p>
                        </div>
                        <Chip color="primary" variant="flat">
                            {assignedUsers.length} đã chọn
                        </Chip>
                    </div>
                </CardHeader>
                <CardBody className="space-y-4">
                    {/* Search and Select All */}
                    <div className="flex gap-4 items-center">
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            startContent={<Search className="w-4 h-4 text-gray-400" />}
                            className="flex-1"
                            variant="bordered"
                        />
                        <Checkbox
                            isSelected={assignedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onValueChange={handleSelectAll}
                        >
                            Chọn tất cả
                        </Checkbox>
                    </div>

                    {/* User List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredUsers.map((user: any) => {
                            const assignment = getUserAssignment(user.userId);
                            const isAssigned = isUserAssigned(user.userId);

                            return (
                                <div
                                    key={user.userId}
                                    className={`p-4 rounded-lg border transition-all ${
                                        isAssigned
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            isSelected={isAssigned}
                                            onValueChange={() => handleUserToggle(user.userId)}
                                        />

                                        <Avatar
                                            src={user.urlImage}
                                            name={user.userName?.charAt(0).toUpperCase()}
                                            size="md"
                                        />

                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 dark:text-white">
                                                {user.fullName || user.userName}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                @{user.userName}
                                            </p>
                                            {user.email && (
                                                <p className="text-xs text-gray-400">
                                                    {user.email}
                                                </p>
                                            )}

                                            {/* Assignment Details */}
                                            {isAssigned && assignment && (
                                                <div className="mt-2 space-y-1">
                                                    {assignment.note && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <FileText className="w-3 h-3" />
                                                            <span className="truncate max-w-40">{assignment.note}</span>
                                                        </div>
                                                    )}
                                                    {assignment.completeAt && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{new Date(assignment.completeAt).toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Chip
                                                color={user.status === "Active" ? "success" : "warning"}
                                                variant="flat"
                                                size="sm"
                                                startContent={<User className="w-3 h-3" />}
                                            >
                                                {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                                            </Chip>

                                            {isAssigned && (
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    color="primary"
                                                    startContent={<Edit className="w-3 h-3" />}
                                                    onClick={() => handleEditUserAssignment(user.userId)}
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Không tìm thấy nhân viên nào</p>
                            <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc chọn kho khác</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Edit User Assignment Modal */}
            <UserAssignmentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                assignment={editingUser}
                onSave={handleSaveUserAssignment}
                users={users}
            />
        </>
    );
};

// Modal component để chỉnh sửa thông tin phân công
interface UserAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: TaskUserAssignment | null;
    onSave: (assignment: TaskUserAssignment) => void;
    users: any[];
}

const UserAssignmentModal: React.FC<UserAssignmentModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     assignment,
                                                                     onSave,
                                                                     users
                                                                 }) => {
    const [formData, setFormData] = useState<TaskUserAssignment>({
        user: '',
        note: '',
        completeAt: ''
    });

    useEffect(() => {
        if (assignment) {
            setFormData(assignment);
        }
    }, [assignment]);

    const handleSave = () => {
        onSave(formData);
    };

    const user = users?.find(u => u.userId === assignment?.user);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={user?.urlImage}
                            name={user?.userName?.charAt(0).toUpperCase()}
                            size="sm"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">Chỉnh sửa phân công</h3>
                            <p className="text-sm text-gray-500">{user?.fullName || user?.userName}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <Textarea
                            label="Ghi chú cho nhân viên"
                            placeholder="Nhập ghi chú, hướng dẫn cụ thể cho nhân viên này..."
                            value={formData.note}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, note: value }))}
                            rows={3}
                            variant="bordered"
                        />

                        <Input
                            type="datetime-local"
                            label="Thời gian hoàn thành dự kiến"
                            value={formData.completeAt}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, completeAt: value }))}
                            startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                            variant="bordered"
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Hủy
                    </Button>
                    <Button color="primary" onPress={handleSave}>
                        Lưu thay đổi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskAssignmentForm;