// components/User/Profile/UserContactForm.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Mail, Phone } from 'lucide-react';
import {UserUpdate} from "@/Store/UserSlice.tsx";

interface UserContactFormProps {
    formData: UserUpdate|null;
    isEditing: boolean;
    onChange: (key: string, value: string) => void;
}

const UserContactForm: React.FC<UserContactFormProps> = ({
                                                             formData,
                                                             isEditing,
                                                             onChange
                                                         }) => {
    console.log(formData);
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
                        value={formData?.email}
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
                        value={formData?.phoneNumber}
                        onValueChange={(value) => onChange('phoneNumber', value)}
                        startContent={<Phone className="w-4 h-4 text-gray-400" />}
                        isReadOnly={!isEditing}
                        classNames={{
                            input: isEditing ? "" : "bg-gray-50 dark:bg-gray-700"
                        }}
                    />
                </div>

            </CardBody>
        </Card>
    );
};

export default UserContactForm;