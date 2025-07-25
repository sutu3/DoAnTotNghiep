import React from 'react';
import {Card, CardHeader, CardBody, Progress, Chip, Spinner} from '@heroui/react';
import { Icon } from '@iconify/react';
import {StackCapacityDetailResponse} from "@/Hooks/useStorageStats.ts";

interface WarehouseCapacityChartProps {
    stackData?: StackCapacityDetailResponse[];
    loading?: boolean;
}

const WarehouseCapacityChart: React.FC<WarehouseCapacityChartProps> = ({
                                                                           stackData = [],
                                                                           loading
                                                                       }) => {
    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:chart-bar" className="text-2xl text-blue-600" />
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Sức Chứa Theo Stack
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Đang tải dữ liệu...
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-center py-8">
                        <Spinner size="lg" />
                    </div>
                </CardBody>
            </Card>
        );
    }

    // Sử dụng trực tiếp dữ liệu từ API thay vì tính toán
    const processedStackData = stackData.map(stack => ({
        stackName: stack.stackName || `Stack ${stack.stackId}`,
        warehouseName: "N/A", // API chưa trả về warehouse name, có thể cần thêm vào backend
        totalBins: stack.totalBins,
        occupiedBins: stack.occupiedBins,
        emptyBins: stack.emptyBins,
        percentage: Math.round(stack.utilizationPercentage),
        status: stack.status // Sử dụng status từ API
    }));

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Icon icon="mdi:chart-bar" className="text-2xl text-blue-600" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Sức Chứa Theo Stack
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Theo dõi tỷ lệ sử dụng của từng stack
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {processedStackData.length > 0 ? (
                        processedStackData?.map((stack, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {stack.stackName}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stack.warehouseName}
                                        </p>
                                    </div>
                                    <Chip
                                        size="sm"
                                        color={
                                            stack.status === 'critical' ? 'danger' :
                                                stack.status === 'warning' ? 'warning' : 'success'
                                        }
                                        variant="flat"
                                    >
                                        {stack.percentage}%
                                    </Chip>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Đã sử dụng: {stack.occupiedBins}/{stack.totalBins}</span>
                                        <span>Còn trống: {stack.emptyBins}</span>
                                    </div>
                                    <Progress
                                        value={stack.percentage}
                                        color={
                                            stack.status === 'critical' ? 'danger' :
                                                stack.status === 'warning' ? 'warning' : 'success'
                                        }
                                        size="sm"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Icon icon="mdi:package-variant-closed" className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Không có dữ liệu stack</p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default WarehouseCapacityChart;