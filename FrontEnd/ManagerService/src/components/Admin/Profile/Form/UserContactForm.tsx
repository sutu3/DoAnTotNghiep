// components/User/Profile/UserContactForm.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Input, Select, SelectItem } from '@heroui/react';
import { Mail, Phone, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { warehouseListSelector } from '@/Store/Selector';

interface UserContactFormProps {
    formData: any;
    isEditing: boolean;
    onChange: (key: string, value: string) => void;
}

const UserContactForm: React.FC<UserContactFormProps> = ({
                                                             formData,
                                                             isEditing,
                                                             onChange
                                                         }) => {
    const warehouses = useSelector(warehouseListSelector);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Thông tin liên hệ & Công việc
                    </h2>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="user@example.com"
                        value={formData.email}
                        onValueChange={(value) => onChange('email', value)}
                        startContent={<Mail className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />

                    <Input
                        label="Số điện thoại"
                        placeholder="0123456789"
                        value={formData.phoneNumber}
                        onValueChange={(value) => onChange('phoneNumber', value)}
                        startContent={<Phone className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />
                </div>

                {isEditing && (
                    <Select
                        label="Kho làm việc"
                        placeholder="Chọn kho"
                        selectedKeys={formData.warehouses ? [formData.warehouses] : []}
                        onSelectionChange={(keys) => {
                            const selectedId = Array.from(keys)[0]?.toString();
                            if (selectedId) {
                                onChange('warehouses', selectedId);
                            }
                        }}
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
                )}
            </CardBody>
        </Card>
    );
};

export default UserContactForm;