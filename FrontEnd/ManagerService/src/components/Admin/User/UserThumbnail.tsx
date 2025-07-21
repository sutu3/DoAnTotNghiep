import React from "react";
import {
    Card,
    CardBody,
    Avatar,
    Chip,
    Button,
    Divider
} from "@heroui/react";
import {
    Mail,
    Phone,
    Calendar,
    Trash2,
    User as UserIcon,
    Building2,
    Clock
} from "lucide-react";

interface UserThumbnailProps {
    user: any;
}

const UserThumbnail: React.FC<UserThumbnailProps> = ({ user }) => {
    if (!user) {
        return (
            <Card className="h-full min-h-[600px]">
                <CardBody className="flex items-center justify-center text-center p-8">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                        <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Chọn nhân viên
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Chọn một nhân viên từ danh sách bên trái để xem thông tin chi tiết
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardBody className="p-6">
                {/* Avatar và tên */}
                <div className="flex flex-col items-center text-center mb-6">
                    <Avatar
                        src={user.urlImage}
                        name={user.userName?.charAt(0).toUpperCase()}
                        className="w-24 h-24 mb-4 text-xl"
                        classNames={{
                            base: "ring-4 ring-green-100 dark:ring-green-900"
                        }}
                    />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        @{user.email}
                    </p>
                    <Chip
                        color={user.status === "Active" ? "success" : "warning"}
                        variant="flat"
                        size="md"
                        className="font-medium"
                    >
                        {user.status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Chip>
                </div>

                <Divider className="mb-6" />

                {/* Thông tin chi tiết */}
                <div className="space-y-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Email
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white break-all">
                                {user.email}
                            </p >
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Số điện thoại
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white font-mono">
                                {user.phoneNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Kho làm việc
                            </p>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {user.warehouses?.warehouseName || "Chưa phân công"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Ngày tạo
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Cập nhật lần cuối
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                <Divider className="my-6" />

                {/* Action buttons */}
                <div className="flex gap-2">
                    {/*<Button*/}
                    {/*    color="primary"*/}
                    {/*    variant="flat"*/}
                    {/*    size="sm"*/}
                    {/*    startContent={<Edit className="w-4 h-4" />}*/}
                    {/*    className="flex-1"*/}
                    {/*>*/}
                    {/*    Chỉnh sửa*/}
                    {/*</Button>*/}
                    {
                        user.email!="admin@gmail.com"&&<Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            startContent={<Trash2 className="w-4 h-4" />}
                            className="flex-1"
                        >
                            Xóa
                        </Button>
                    }

                </div>
            </CardBody>
        </Card>
    );
};

export default UserThumbnail;