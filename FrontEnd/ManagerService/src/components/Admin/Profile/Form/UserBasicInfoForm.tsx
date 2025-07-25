import React from 'react';
import { Card, CardBody, CardHeader, Input, Avatar } from '@heroui/react';
import { User, Mail, Phone, Image } from 'lucide-react';

interface UserBasicInfoFormProps {
    formData: any;
    isEditing: boolean;
    onChange: (key: string, value: string) => void;
}

const UserBasicInfoForm: React.FC<UserBasicInfoFormProps> = ({
                                                                 formData,
                                                                 isEditing,
                                                                 onChange
                                                             }) => {
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
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                    <Avatar
                        src={formData.urlImage}
                        name={formData.userName?.charAt(0).toUpperCase()}
                        className="w-16 h-16 text-xl"
                    />
                    {isEditing && (
                        <Input
                            label="URL Ảnh đại diện"
                            placeholder="https://example.com/avatar.jpg"
                            value={formData.urlImage}
                            onValueChange={(value) => onChange('urlImage', value)}
                            startContent={<Image className="w-4 h-4 text-gray-400" />}
                            className="flex-1"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tên đăng nhập"
                        placeholder="username"
                        value={formData.userName}
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
                        value={formData.fullName}
                        onValueChange={(value) => onChange('fullName', value)}
                        startContent={<User className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />
                </div>

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
            </CardBody>
        </Card>
    );
};

export default UserBasicInfoForm;