import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import { Save, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {MiddleUpdateDescriptionTaskType, MiddleUpdateTaskType, TaskTypeCreated} from '@/Store/TaskTypeSlice';

interface TaskTypeEditModalProps {
    setEditId: (id: string) => void;
    taskTypeId: string | null;
    warehouse:string;
    isOpen: boolean;
    onClose: () => void;
    taskType: TaskTypeCreated | null;
    onSuccess: () => void;
}

const TaskTypeEditModal: React.FC<TaskTypeEditModalProps> = ({setEditId,taskTypeId,warehouse,
                                                                 isOpen,
                                                                 onClose,
                                                                 taskType,
                                                                 onSuccess
                                                             }) => {
    const dispatch = useDispatch();
    console.log(taskTypeId)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TaskTypeCreated>({
        taskName: '',
        description: '',
        warehouses:''
    });

    useEffect(() => {
        if (taskType) {
            setFormData({
                taskName: taskType.taskName || '',
                description: taskType.description || '',
                warehouses:warehouse||''
            });
        }
    }, [taskType,warehouse]);

    const handleSave = async () => {
        if (!taskType || !formData.taskName.trim()) return;

        setLoading(true);
        try {
             await (dispatch as any)(MiddleUpdateDescriptionTaskType(taskTypeId||"",formData.description ));
            setEditId("")
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating task type:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ taskName: '', description: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
            <ModalContent>
                <ModalHeader>
                    <h2 className="text-xl font-bold">Chỉnh sửa loại nhiệm vụ</h2>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            disabled={true}
                            label="Tên nhiệm vụ"
                            placeholder="Nhập tên nhiệm vụ"
                            value={formData.taskName}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, taskName: value }))}
                            isRequired
                        />

                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả chi tiết cho loại nhiệm vụ"
                            value={formData.description}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                            rows={4}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={handleClose}
                        startContent={<X className="w-4 h-4" />}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSave}
                        isLoading={loading}
                        startContent={<Save className="w-4 h-4" />}
                    >
                        Lưu thay đổi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskTypeEditModal;