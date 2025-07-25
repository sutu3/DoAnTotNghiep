import React, {useEffect, useState} from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from '@heroui/react';
import { Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { MiddleAddTaskType, TaskTypeCreated } from '@/Store/TaskTypeSlice';
import { warehouseListSelector } from '@/Store/Selector';

interface TaskTypeCreateModalProps {
    warehouse?: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TaskTypeCreateModal: React.FC<TaskTypeCreateModalProps> = ({
    warehouse,
                                                                     isOpen,
                                                                     onClose,
                                                                     onSuccess
                                                                 }) => {
    const dispatch = useDispatch();
    const warehouses = useSelector(warehouseListSelector);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TaskTypeCreated>({
        taskName: '',
        description: '',
        warehouses: ''
    });
    useEffect(() => {
        const newFormdata={...formData,warehouses:warehouse};
        setFormData(newFormdata)
    }, [warehouse]);

    const handleFormChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.taskName.trim()) return;

        setLoading(true);
        try {
            await (dispatch as any)(MiddleAddTaskType(formData));
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error creating task type:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            taskName: '',
            description: '',
            warehouses: ''
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white dark:bg-gray-800",
                header: "border-b border-gray-200 dark:border-gray-700",
                body: "py-6",
                footer: "border-t border-gray-200 dark:border-gray-700"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">
                            Thêm loại nhiệm vụ mới
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                        Tạo loại nhiệm vụ mới cho kho
                    </p>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Tên nhiệm vụ"
                            placeholder="Nhập tên loại nhiệm vụ"
                            value={formData.taskName}
                            onValueChange={(value) => handleFormChange('taskName', value)}
                            isRequired
                            variant="bordered"
                        />

                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả chi tiết cho loại nhiệm vụ"
                            value={formData.description}
                            onValueChange={(value) => handleFormChange('description', value)}
                            rows={4}
                            variant="bordered"
                        />

                        <Select
                            label="Kho áp dụng"
                            placeholder="Chọn kho"
                            disabled={true}
                            selectedKeys={formData.warehouses ? [formData.warehouses] : []}
                            onSelectionChange={(keys) => {
                                const selectedId = Array.from(keys)[0]?.toString();
                                if (selectedId) {
                                    handleFormChange('warehouses', selectedId);
                                }
                            }}
                            variant="bordered"
                        >
                            {warehouses?.map((warehouse: any) => (
                                <SelectItem
                                    key={warehouse.warehouseId}
                                    value={warehouse.warehouseId}
                                    textValue={warehouse.warehouseName}
                                >
                                    {warehouse.warehouseName}
                                </SelectItem>
                            ))}
                        </Select>
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
                        onPress={handleSubmit}
                        isLoading={loading}
                        isDisabled={!formData.taskName.trim()}
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo nhiệm vụ'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskTypeCreateModal;