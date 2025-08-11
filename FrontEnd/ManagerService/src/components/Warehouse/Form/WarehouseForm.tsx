import React from 'react';
import { Input,  Textarea } from '@heroui/react';
import {Building2, Package} from 'lucide-react';

interface WarehouseBasicFormProps {
    data: {
        warehouseName: string;
        description?: string;
    };
    onChange: (key: string, value: string) => void;
}

const WarehouseBasicForm: React.FC<WarehouseBasicFormProps> = ({ data, onChange }) => {



    return (
        <div className="space-y-6">
                <Input
                    label="Tên warehouse"
                    placeholder="Nhập tên warehouse"
                    value={data.warehouseName}
                    onValueChange={(val) => onChange("warehouseName", val)}
                    startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                    validate={(value) => {
                        if (value.length < 3) {
                            return "Tên warehouse phải có ít nhất 3 ký tự";
                        }
                    }}
                    classNames={{
                        input: "text-gray-800 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                />

            <Textarea
                label="Mô tả"
                placeholder="Nhập mô tả về warehouse (tùy chọn)"
                value={data.description || ""}
                onValueChange={(val) => onChange("description", val)}
                minRows={3}
                startContent={<Package className="w-4 h-4 text-gray-400" />}
                classNames={{
                    input: "text-gray-800 dark:text-white",
                    label: "text-gray-700 dark:text-gray-300"
                }}
            />
        </div>
    );
};

export default WarehouseBasicForm;