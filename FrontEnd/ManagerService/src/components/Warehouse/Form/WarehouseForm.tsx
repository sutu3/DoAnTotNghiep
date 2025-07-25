import React, { useState, useEffect } from 'react';
import { Input, Select, SelectItem, Textarea } from '@heroui/react';
import {Building2, Package, User} from 'lucide-react';
import {UserData} from "@/Store/UserSlice.tsx";

interface WarehouseBasicFormProps {
    data: {
        warehouseName: string;
        managerId: string;
        description?: string;
    };
    onChange: (key: string, value: string) => void;
}

const WarehouseBasicForm: React.FC<WarehouseBasicFormProps> = ({ data, onChange }) => {
    const [managers, setManagers] = useState<UserData[]>([]);

    useEffect(() => {
        // Load managers từ API - sử dụng pattern tương tự UserThunk
        loadManagers();
    }, []);

    const loadManagers = async () => {
        try {
            // API call để lấy danh sách user có role manager
            // const response = await fetch(API_ROUTES.user.managers);
            // setManagers(response.data);

            // Mock data for now
            // setManagers([
            //     { userId: "manager1", userName: "Nguyễn Văn A", fullName: "Nguyễn Văn A" },
            //     { userId: "manager2", userName: "Trần Thị B", fullName: "Trần Thị B" },
            //     { userId: "manager3", userName: "Lê Văn C", fullName: "Lê Văn C" },
            // ]);
        } catch (error) {
            console.error('Failed to load managers:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Select
                    label="Người quản lý"
                    placeholder="Chọn người quản lý warehouse"
                    selectedKeys={data.managerId ? [data.managerId] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        onChange("managerId", selectedKey);
                    }}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                >
                    {managers.map((manager) => (
                        <SelectItem key={manager.userId} value={manager.userId}>
                            {manager.fullName}
                        </SelectItem>
                    ))}
                </Select>
            </div>

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