import React from 'react';
import { Card, CardBody, CardHeader, Input, Textarea, Select, SelectItem } from '@heroui/react';
import { Package, AlertTriangle, Calendar, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { warehouseListSelector } from '@/Store/Selector';

interface TaskBasicInfoFormProps {
    formData: any;
    onChange: (key: string, value: string) => void;
    taskTypes: any[];
    currentStep: number;
    onStepChange: (step: number) => void;
}

const TaskBasicInfoForm: React.FC<TaskBasicInfoFormProps> = ({
                                                                 formData,
                                                                 onChange,
                                                                 taskTypes,
                                                                 currentStep
                                                             }) => {
    const warehouses = useSelector(warehouseListSelector);

    return (
        <Card className={`shadow-lg transition-all ${currentStep === 1 ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Bước 1: Thông tin cơ bản nhiệm vụ
                    </h2>
                </div>
            </CardHeader>
            <CardBody className="space-y-6">
                <Select
                    label="Kho áp dụng"
                    placeholder="Chọn kho"
                    selectedKeys={formData.warehouses ? [formData.warehouses] : []}
                    onSelectionChange={(keys) => {
                        const selectedId = Array.from(keys)[0]?.toString();
                        if (selectedId) {
                            onChange('warehouses', selectedId);
                        }
                    }}
                    isRequired
                    variant="bordered"
                    startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                >
                    {warehouses?.map((warehouse: any) => (
                        <SelectItem
                            key={warehouse.warehouseId}
                            value={warehouse.warehouseId}
                            textValue={warehouse.warehouseName}
                        >
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                <span>{warehouse.warehouseName}</span>
                            </div>
                        </SelectItem>
                    ))}
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Loại nhiệm vụ"
                        placeholder="Chọn loại nhiệm vụ"
                        selectedKeys={formData.taskType ? [formData.taskType] : []}
                        onSelectionChange={(keys) => {
                            const selectedName = Array.from(keys)[0]?.toString();
                            if (selectedName) {
                                onChange('taskType', selectedName);
                            }
                        }}
                        isRequired
                        variant="bordered"
                    >
                        {taskTypes?.map((taskType: any) => (
                            <SelectItem
                                key={taskType.taskName}
                                value={taskType.taskName}
                                textValue={taskType.taskName}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{taskType.taskName}</span>
                                    <span className="text-xs text-gray-500">{taskType.description}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>

                    <Select
                        label="Mức độ ưu tiên"
                        placeholder="Chọn mức độ ưu tiên"
                        selectedKeys={[formData.level]}
                        onSelectionChange={(keys) => {
                            const selectedLevel = Array.from(keys)[0]?.toString();
                            if (selectedLevel) {
                                onChange('level', selectedLevel);
                            }
                        }}
                        variant="bordered"
                        startContent={<AlertTriangle className="w-4 h-4 text-gray-400" />}
                    >
                        <SelectItem key="Low" value="Low">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Thấp</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="Medium" value="Medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span>Trung bình</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="Hight" value="Hight">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Cao</span>
                            </div>
                        </SelectItem>
                    </Select>
                </div>



                <Textarea
                    label="Mô tả nhiệm vụ"
                    placeholder="Nhập mô tả chi tiết cho nhiệm vụ"
                    value={formData.description}
                    onValueChange={(value) => onChange('description', value)}
                    rows={4}
                    isRequired
                    variant="bordered"
                />

                <Input
                    type="date"
                    label="Hạn hoàn thành"
                    value={formData.completeAt}
                    onValueChange={(value) => onChange('completeAt', value)}
                    startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                    variant="bordered"
                />
            </CardBody>
        </Card>
    );
};

export default TaskBasicInfoForm;