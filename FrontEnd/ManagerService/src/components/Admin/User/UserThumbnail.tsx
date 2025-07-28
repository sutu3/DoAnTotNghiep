import React, { useState } from "react";
import {
    Card,
    CardBody,
    Avatar,
    Chip,
    Button,
    Divider,
    Select,
    SelectItem
} from "@heroui/react";
import {
    Mail,
    Phone,
    Trash2,
    User as UserIcon,
    Building2,
    Edit3,
    Check,
    X
} from "lucide-react";

interface UserThumbnailProps {
    user: any;
    onRoleUpdate?: (userId: string, newRoles: string[]) => void; // Thay đổi để nhận array
}

const UserThumbnail: React.FC<UserThumbnailProps> = ({ user, onRoleUpdate }) => {
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [tempRoles, setTempRoles] = useState<string[]>([]); // Thay đổi thành array

    const roles = [
        { key: "MANAGER", label: "Quản lý", color: "primary" },
        { key: "STAFF", label: "Nhân viên", color: "success" },
    ];

    const handleRoleEdit = () => {
        // Lấy tất cả roles hiện tại
        const currentRoles = user.roles?.map((role: any) => role.roleName) || [];
        setTempRoles(currentRoles);
        setIsEditingRole(true);
    };

    const handleRoleSave = () => {
        if (onRoleUpdate && tempRoles.length > 0) {
            onRoleUpdate(user.userId, tempRoles);
        }
        setIsEditingRole(false);
        setTempRoles([]);
    };

    const handleRoleCancel = () => {
        setIsEditingRole(false);
        setTempRoles([]);
    };

    const getRoleColor = (roleName: string) => {
        const role = roles.find(r => r.key === roleName);
        return role?.color || "default";
    };

    const getRoleLabel = (roleName: string) => {
        const role = roles.find(r => r.key === roleName);
        return role?.label || roleName;
    };

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

    const currentRoles = user.roles || [];

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
                    {/* Các field khác giữ nguyên */}
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
                            </p>
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

                    {/* Multi-Role Section */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Vai trò
                            </p>
                            {isEditingRole ? (
                                <div className="space-y-3">
                                    <Select
                                        label="Chọn vai trò"
                                        placeholder="Chọn các vai trò"
                                        selectionMode="multiple"
                                        selectedKeys={new Set(tempRoles)}
                                        onSelectionChange={(keys) => {
                                            const selectedRoles = Array.from(keys) as string[];
                                            setTempRoles(selectedRoles);
                                        }}
                                        classNames={{
                                            trigger: "min-h-12",
                                            label: "text-gray-700 dark:text-gray-300",
                                            value: "text-gray-800 dark:text-white"
                                        }}
                                        renderValue={(items) => (
                                            <div className="flex flex-wrap gap-2">
                                                {items.map((item) => (
                                                    <Chip
                                                        key={item.key}
                                                        color="primary"
                                                        variant="flat"
                                                        size="sm"
                                                        className="text-xs"
                                                    >
                                                        {item.textValue}
                                                    </Chip>
                                                ))}
                                            </div>
                                        )}
                                    >
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.key}
                                                value={role.key}
                                                textValue={role.label}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-indigo-600" />
                                                    <span>{role.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                            onClick={handleRoleSave}
                                            startContent={<Check className="w-3 h-3" />}
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onClick={handleRoleCancel}
                                            startContent={<X className="w-3 h-3" />}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-x-2 flex flex-row ">
                                    <div className="flex-wrap gap-2">
                                        {currentRoles.length > 0 ? (
                                            currentRoles.map((role: any, index: number) => (
                                                <Chip
                                                    key={index}
                                                    size="sm"
                                                    color={getRoleColor(role.roleName)}
                                                    variant="flat"
                                                    className="capitalize w-[15px]"
                                                >
                                                    {getRoleLabel(role.roleName)}
                                                </Chip>
                                            ))
                                        ) : (
                                            <Chip
                                                size="sm"
                                                color="default"
                                                variant="flat"
                                            >
                                                Chưa có vai trò
                                            </Chip>
                                        )}
                                    </div>
                                    {user.email !== "admin@gmail.com" && (
                                        <Button
                                            size="sm"
                                            variant="light"
                                            onClick={handleRoleEdit}
                                            startContent={<Edit3 className="w-3 h-3" />}
                                        >
                                            Chỉnh sửa vai trò
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Các field khác giữ nguyên */}
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
                </div>

                <Divider className="my-6" />

                {/* Action buttons */}
                <div className="flex gap-2">
                    {user.email !== "admin@gmail.com" && (
                        <Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            startContent={<Trash2 className="w-4 h-4" />}
                            className="flex-1"
                        >
                            Xóa
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default UserThumbnail;