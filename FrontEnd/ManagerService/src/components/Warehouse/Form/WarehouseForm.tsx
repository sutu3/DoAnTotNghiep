import React from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Building2, MapPin, Package, User } from "lucide-react";

interface WarehouseFormProps {
    data: {
        warehouseName: string;
        address: string;
        capacity: number;
        manager: string;
        description?: string;
    };
    onChange: (key: string, value: string | number) => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ data, onChange }) => {
    const managers = [
        { key: "manager1", label: "Nguyễn Văn A" },
        { key: "manager2", label: "Trần Thị B" },
        { key: "manager3", label: "Lê Văn C" },
    ];

    return (
        <div className="space-y-6">
            {/* Warehouse Information Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thông tin kho
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tên kho"
                        placeholder="Nhập tên kho"
                        value={data.warehouseName}
                        onValueChange={(val) => onChange("warehouseName", val)}
                        startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                        validate={(value) => {
                            if (value.length < 3) {
                                return "Tên kho phải có ít nhất 3 ký tự";
                            }
                        }}
                        classNames={{
                            input: "text-gray-800 dark:text-white",
                            label: "text-gray-700 dark:text-gray-300"
                        }}
                    />

                    <Input
                        label="Sức chứa (m³)"
                        type="number"
                        placeholder="0"
                        value={data.capacity.toString()}
                        onValueChange={(val) => onChange("capacity", parseInt(val) || 0)}
                        startContent={<Package className="w-4 h-4 text-gray-400" />}
                        validate={(value) => {
                            const num = parseInt(value);
                            if (num <= 0) {
                                return "Sức chứa phải lớn hơn 0";
                            }
                        }}
                        classNames={{
                            input: "text-gray-800 dark:text-white",
                            label: "text-gray-700 dark:text-gray-300"
                        }}
                    />
                </div>

                <Input
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ kho"
                    value={data.address}
                    onValueChange={(val) => onChange("address", val)}
                    startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                    validate={(value) => {
                        if (value.length < 10) {
                            return "Địa chỉ phải có ít nhất 10 ký tự";
                        }
                    }}
                    classNames={{
                        input: "text-gray-800 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                />
            </div>

            {/* Management Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Quản lý
                    </h3>
                </div>

                <Select
                    label="Người quản lý"
                    placeholder="Chọn người quản lý kho"
                    selectedKeys={data.manager ? [data.manager] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        onChange("manager", selectedKey);
                    }}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                >
                    {managers.map((manager) => (
                        <SelectItem key={manager.key} value={manager.key}>
                            {manager.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thông tin bổ sung
                    </h3>
                </div>

                <Textarea
                    label="Mô tả"
                    placeholder="Nhập mô tả về kho (tùy chọn)"
                    value={data.description || ""}
                    onValueChange={(val) => onChange("description", val)}
                    minRows={3}
                    classNames={{
                        input: "text-gray-800 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                />
            </div>
        </div>
    );
};

export default WarehouseForm;