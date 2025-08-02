import React from 'react';
import { Card, CardBody, CardHeader, Input, Textarea, Select, SelectItem, Checkbox } from '@heroui/react';
import { Package, AlertTriangle, Calendar, Building2, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { warehouseListSelector } from '@/Store/Selector';

interface TaskBasicInfoFormProps {
    formData: any;
    onChange: (key: string, value: string|boolean) => void;
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
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Yêu cầu minh chứng</h4>
                                <p className="text-sm text-gray-600">
                                    Nhân viên cần upload ảnh khi hoàn thành nhiệm vụ
                                </p>
                            </div>
                        </div>
                        <Checkbox
                            isSelected={formData.requiresEvidence || false}
                            onValueChange={(checked) =>
                                onChange("requiresEvidence",checked )
                            }
                            color="warning"
                        />
                    </div>

                    {/* Hiển thị thông tin bổ sung khi bật requiresEvidence */}
                    {formData.requiresEvidence && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div className="text-sm text-orange-800">
                                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Nhân viên bắt buộc phải upload ảnh minh chứng</li>
                                        <li>• Không thể hoàn thành nhiệm vụ nếu thiếu ảnh</li>
                                        <li>• Ảnh sẽ được lưu trữ để kiểm tra sau này</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
            </CardBody>
        </Card>
    );
};

export default TaskBasicInfoForm;