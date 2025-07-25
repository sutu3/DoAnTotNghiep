import React from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { WarehouseCapacityStatsResponse} from "@/Hooks/useStorageStats.ts";

interface StorageOverviewCardsProps {
    capacityData?: WarehouseCapacityStatsResponse;
    loading?: boolean;
}

const StorageOverviewCards: React.FC<StorageOverviewCardsProps> = ({
                                                                       capacityData,
                                                                       loading
                                                                   }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardBody className="p-6">
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    }

    // Sử dụng dữ liệu từ API thay vì tính toán từ stacks
    const totalBins = capacityData?.totalBins || 0;
    const emptyBins = capacityData?.emptyBins || 0;
    const occupiedBins = capacityData?.occupiedBins || 0;
    const utilizationPercentage = capacityData?.utilizationPercentage || 0;
    const criticalStacks = capacityData?.criticalStacks || 0;

    const overviewData = [
        {
            title: "Tổng Sức Chứa",
            value: `${occupiedBins}/${totalBins}`,
            percentage: utilizationPercentage,
            icon: "mdi:warehouse",
            color: "blue",
            bgColor: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-600"
        },
        {
            title: "Bin Trống",
            value: emptyBins.toString(),
            percentage: totalBins > 0 ? Math.round((emptyBins / totalBins) * 100) : 0,
            icon: "mdi:package-variant-closed",
            color: "green",
            bgColor: "bg-green-100 dark:bg-green-900",
            textColor: "text-green-600"
        },
        {
            title: "Bin Đã Sử Dụng",
            value: occupiedBins.toString(),
            percentage: totalBins > 0 ? Math.round((occupiedBins / totalBins) * 100) : 0,
            icon: "mdi:package-variant",
            color: "orange",
            bgColor: "bg-orange-100 dark:bg-orange-900",
            textColor: "text-orange-600"
        },
        {
            title: "Stack Gần Đầy",
            value: criticalStacks.toString(),
            percentage: criticalStacks > 0 ? 100 : 0, // Hiển thị 100% nếu có stack critical
            icon: "mdi:alert-circle",
            color: "red",
            bgColor: "bg-red-100 dark:bg-red-900",
            textColor: "text-red-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewData.map((item, index) => (
                <Card
                    key={index}
                    className="border-l-4 border-l-current"
                    style={{
                        borderLeftColor: item.color === 'blue' ? '#3b82f6' :
                            item.color === 'green' ? '#10b981' :
                                item.color === 'orange' ? '#f59e0b' : '#ef4444'
                    }}
                >
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {item.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {item.value}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={item.percentage}
                                        color={item.color as any}
                                        size="sm"
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-medium text-gray-600">
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 ${item.bgColor} rounded-full ml-4`}>
                                <Icon icon={item.icon} className={`text-2xl ${item.textColor}`} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default StorageOverviewCards;