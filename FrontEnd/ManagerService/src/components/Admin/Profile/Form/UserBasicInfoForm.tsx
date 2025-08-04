import React, {useState} from 'react';
import {Card, CardBody, CardHeader, Input, Avatar, SelectItem, Select} from '@heroui/react';
import {User, Mail, Phone, Calendar, Home, Users} from 'lucide-react';
import { UserUpdate} from "@/Store/UserSlice.tsx";
import {Icon} from "@iconify/react";
import {useFileStore} from "@/zustand/File.tsx";

interface UserBasicInfoFormProps {
    formData: UserUpdate|null;
    isEditing: boolean;
    onChange: (key: string, value: string) => void;
}
const UserBasicInfoForm: React.FC<UserBasicInfoFormProps> = ({
                                                                 formData,
                                                                 isEditing,
                                                                 onChange
                                                             }) => {
    const [previewUrl, setPreviewUrl] =useState<string>('');
    console.log("Edit"+formData)
    const {setFile}=useFileStore()
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onChange("urlImage",url);
        }
    };
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Thông tin cơ bản
                    </h2>
                </div>
            </CardHeader>
            <CardBody className="space-y-6">
                {/* Avatar Section - giữ nguyên */}
                <div className="flex items-center gap-4">
                    <Avatar
                        src={formData?.urlImage}
                        name={formData?.userName?.charAt(0).toUpperCase()}
                        className="w-16 h-16 text-xl"
                    />
                    {isEditing && (
                        <Input
                            type="file"
                            accept="image/*"
                            label="Hình ảnh sản phẩm"
                            onChange={handleImageChange}
                            startContent={<Icon icon="mdi:image" />}
                        />
                    )}

                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tên đăng nhập"
                        placeholder="username"
                        value={formData?.userName || ''}
                        onValueChange={(value) => onChange('userName', value)}
                        startContent={<User className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />

                    <Input
                        label="Họ và tên"
                        placeholder="Nguyễn Văn A"
                        value={formData?.fullName || ''}
                        onValueChange={(value) => onChange('fullName', value)}
                        startContent={<User className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />
                </div>

                {/* Personal Info Grid - Thêm section mới */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Ngày sinh"
                        value={formData?.dateOfBirth || ''}
                        onValueChange={(value) => onChange('dateOfBirth', value)}
                        startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />

                    <Select
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        selectedKeys={formData?.gender ? [formData.gender] : []}
                        onSelectionChange={(keys) => {
                            const selectedGender = Array.from(keys)[0]?.toString();
                            if (selectedGender) {
                                onChange('gender', selectedGender);
                            }
                        }}
                        startContent={<Users className="w-4 h-4 text-gray-400" />}
                        isDisabled={!isEditing}
                    >
                        <SelectItem key="MALE" value="MALE">Nam</SelectItem>
                        <SelectItem key="FEMALE" value="FEMALE">Nữ</SelectItem>
                        <SelectItem key="OTHER" value="OTHER">Khác</SelectItem>
                    </Select>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="user@example.com"
                        value={formData?.email || ''}
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
                        value={formData?.phoneNumber || ''}
                        onValueChange={(value) => onChange('phoneNumber', value)}
                        startContent={<Phone className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />
                </div>

                {/* Home Address */}
                <Input
                    label="Địa chỉ nhà"
                    placeholder="Nhập địa chỉ nhà"
                    value={formData?.homeAddress || ''}
                    onValueChange={(value) => onChange('homeAddress', value)}
                    startContent={<Home className="w-4 h-4 text-gray-400" />}
                    isReadOnly={!isEditing}
                    classNames={{
                        input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                    }}
                />
            </CardBody>
        </Card>
    );
};
export default UserBasicInfoForm;