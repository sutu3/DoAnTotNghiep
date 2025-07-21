import React from "react";
import {
    Card,
    CardBody,
    Chip,
    Button,
    Divider,
    Progress
} from "@heroui/react";
import {
    Building2,
    MapPin,
    User,
    Calendar,
    Edit,
    Trash2,
    Package,
} from "lucide-react";

interface WarehouseThumbnailProps {
    warehouse: any;
}

const WarehouseThumbnail: React.FC<WarehouseThumbnailProps> = ({ warehouse }) => {
    if (!warehouse) {
        return (
            <Card className="h-full min-h-[600px]">
                <CardBody className="flex items-center justify-center text-center p-8">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                        <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Chọn kho
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Chọn một kho từ danh sách bên trái để xem thông tin chi tiết
                    </p>
                </CardBody>
            </Card>
        );
    }

    const stockPercentage = warehouse.capacity ?
        Math.round((warehouse.currentStock / warehouse.capacity) * 100) : 0;

    return (
        <Card className="h-full">
            <CardBody className="p-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-4 mb-4">
                        <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {warehouse.warehouseName}
                    </h3>
                    <div className="flex gap-2">
                        <Chip
                            color={warehouse.status === "Active" ? "success" : "warning"}
                            variant="flat"
                            size="md"
                            className="font-medium"
                        >
                            {warehouse.status === "Active" ? "Đang hoạt động" : "Tạm dừng"}
                        </Chip>
                    </div>
                </div>

                <Divider className="mb-6" />

                {/* Storage Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tỷ lệ sử dụng kho
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                            {stockPercentage}%
                        </span>
                    </div>
                    <Progress
                        value={stockPercentage}
                        color={stockPercentage > 80 ? "danger" : stockPercentage > 60 ? "warning" : "success"}
                        className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{warehouse.currentStock?.toLocaleString() || 0} m³</span>
                        <span>{warehouse.capacity?.toLocaleString() || 0} m³</span>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="space-y-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Địa chỉ
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {warehouse.address || "Chưa có địa chỉ"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Sức chứa
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {warehouse.capacity ? `${warehouse.capacity.toLocaleString()} m³` : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                            <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Quản lý
                            </p>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {warehouse.manager?.fullName || "Chưa phân công"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Ngày tạo
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {warehouse.createdAt ? new Date(warehouse.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                <Divider className="my-6" />

                {/* Action buttons */}
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        startContent={<Edit className="w-4 h-4" />}
                        className="flex-1"
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        startContent={<Trash2 className="w-4 h-4" />}
                        className="flex-1"
                    >
                        Xóa
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default WarehouseThumbnail;