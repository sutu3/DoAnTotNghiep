import React from "react";
import {
    Card,
    CardBody,
    Chip,
    Button,
    Divider
} from "@heroui/react";
import {
    Ruler,
    Hash,
    Calculator,
    Layers,
    Calendar,
    Edit,
    Trash2,
    CheckCircle
} from "lucide-react";

interface UnitThumbnailProps {
    unit: any;
}

const UnitThumbnail: React.FC<UnitThumbnailProps> = ({ unit }) => {
    if (!unit) {
        return (
            <Card className="h-full min-h-[600px]">
                <CardBody className="flex items-center justify-center text-center p-8">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                        <Ruler className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Chọn đơn vị
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Chọn một đơn vị từ danh sách bên trái để xem thông tin chi tiết
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardBody className="p-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-4 mb-4">
                        <Ruler className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {unit.unitName}
                    </h3>
                    <div className="flex gap-2">
                        <Chip
                            color={unit.isDefault ? "success" : "default"}
                            variant="flat"
                            size="md"
                            className="font-medium"
                        >
                            {unit.isDefault ? "Đơn vị mặc định" : "Đơn vị thường"}
                        </Chip>
                    </div>
                </div>

                <Divider className="mb-6" />

                {/* Thông tin chi tiết */}
                <div className="space-y-5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Tên viết tắt
                            </p>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-white inline-block">
                                {unit.shortName || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <Calculator className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Tỷ lệ quy đổi
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {unit.ratioToBase ? `${unit.ratioToBase}x` : "1x (đơn vị cơ sở)"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Nhóm đơn vị
                            </p>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {unit.groupUnit?.groupName || "N/A"}
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
                                {unit.createdAt ? new Date(unit.createdAt).toLocaleDateString("vi-VN") : "N/A"}
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

export default UnitThumbnail;