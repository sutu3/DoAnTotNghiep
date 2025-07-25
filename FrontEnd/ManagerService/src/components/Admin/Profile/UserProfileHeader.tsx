import React from 'react';
import { Card, CardBody, Avatar, Chip, Button } from '@heroui/react';
import { ArrowLeft, Edit3, User as UserIcon } from 'lucide-react';

interface UserProfileHeaderProps {
    user: any;
    isEditing: boolean;
    onEdit: () => void;
    onBack: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
                                                                 user,
                                                                 isEditing,
                                                                 onEdit,
                                                                 onBack
                                                             }) => {
    return (
        <div className="mb-8">
            <Button
                variant="light"
                startContent={<ArrowLeft className="w-4 h-4" />}
                onClick={onBack}
                className="mb-6"
            >
                Quay lại danh sách
            </Button>

            <Card className="shadow-lg">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={user.urlImage}
                                name={user.userName?.charAt(0).toUpperCase()}
                                className="w-20 h-20 text-2xl"
                                classNames={{
                                    base: "ring-4 ring-blue-100 dark:ring-blue-900"
                                }}
                            />

                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    {user.fullName || user.userName}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-3">
                                    @{user.userName}
                                </p>
                                <div className="flex gap-2">
                                    <Chip
                                        color={user.status === "Active" ? "success" : "warning"}
                                        variant="flat"
                                        startContent={<UserIcon className="w-3 h-3" />}
                                    >
                                        {user.status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button
                                color="primary"
                                startContent={<Edit3 className="w-4 h-4" />}
                                onClick={onEdit}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default UserProfileHeader;