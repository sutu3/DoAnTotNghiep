import { Card, CardBody, CardHeader, Progress, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

const WarehouseCapacityWidget = () => {
    const warehouseData = {
        totalCapacity: 10000,
        usedCapacity: 7800,
        availableCapacity: 2200,
        utilizationRate: 78
    };

    const getCapacityColor = (rate: number) => {
        if (rate >= 90) return "danger";
        if (rate >= 75) return "warning";
        return "success";
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:warehouse" className="text-xl text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Sức Chứa Kho
                    </h3>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ sử dụng</span>
                        <Chip
                            size="sm"
                            color={getCapacityColor(warehouseData.utilizationRate)}
                            variant="flat"
                        >
                            {warehouseData.utilizationRate}%
                        </Chip>
                    </div>
                    <Progress
                        value={warehouseData.utilizationRate}
                        color={getCapacityColor(warehouseData.utilizationRate)}
                        size="md"
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-blue-600 dark:text-blue-400 font-semibold">
                            {warehouseData.totalCapacity.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                            Tổng sức chứa
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="text-green-600 dark:text-green-400 font-semibold">
                            {warehouseData.availableCapacity.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                            Còn trống
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Icon icon="mdi:information" className="text-blue-500" />
                        <span>Cập nhật lần cuối: 10 phút trước</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default WarehouseCapacityWidget;