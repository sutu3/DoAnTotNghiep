import React from 'react';
import { Card, CardHeader, CardBody, Progress, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface WarehouseCapacityChartProps {
    stacks: any[];
}

const WarehouseCapacityChart: React.FC<WarehouseCapacityChartProps> = ({ stacks }) => {
    const getStackCapacityData = () => {
        return stacks?.map(stack => {
            const totalBins = stack.bin?.length || 0;
            const emptyBins = stack.bin?.filter((bin: any) => bin.status === "EMPTY").length || 0;
            const occupiedBins = totalBins - emptyBins;
            const percentage = totalBins > 0 ? Math.round((occupiedBins / totalBins) * 100) : 0;

            return {
                stackName: stack.stackName || `Stack ${stack.stackId}`,
                warehouseName: stack.warehouse?.warehouseName || "N/A",
                totalBins,
                occupiedBins,
                emptyBins,
                percentage,
                status: percentage > 90 ? 'critical' : percentage > 70 ? 'warning' : 'normal'
            };
        })||[];
    };

    const stackData = getStackCapacityData();

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
                    {stackData.map((stack, index) => (
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
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default WarehouseCapacityChart;