import React from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import {StackType} from "@/Store/StackSlice.tsx";

interface StorageOverviewCardsProps {
    stacks: StackType[];
}

const StorageOverviewCards: React.FC<StorageOverviewCardsProps> = ({ stacks }) => {
    // Tính toán thống kê từ stacks data
    const safeStacks = stacks || [];

    const totalBins = safeStacks.reduce((acc, stack) => acc + (stack?.bin?.length || 0), 0);
    const emptyBins = safeStacks.reduce((acc, stack) =>
        acc + (stack?.bin?.filter((bin: any) => bin.status === "EMPTY")?.length || 0), 0
    );
    const occupiedBins = totalBins - emptyBins;
    const criticalStacks = safeStacks.filter(stack => {
        const binLength = stack?.bin?.length || 0;
        if (binLength === 0) return false;

        const nonEmptyBins = stack.bin.filter((bin: any) => bin.status !== "EMPTY").length;
        const stackCapacity = (nonEmptyBins / binLength) * 100;
        return stackCapacity > 90;
    }).length||0;

    const overviewData = [
        {
            title: "Tổng Sức Chứa",
            value: `${occupiedBins}/${totalBins}`,
            percentage: safeStacks.length > 0 ? Math.round((criticalStacks / safeStacks.length) * 100) : 0,
            icon: "mdi:warehouse",
            color: "blue",
            bgColor: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-600"
        },
        {
            title: "Bin Trống",
            value: emptyBins.toString()||"",
            percentage: safeStacks.length > 0 ? Math.round((criticalStacks / safeStacks.length) * 100) : 0,
            icon: "mdi:package-variant-closed",
            color: "green",
            bgColor: "bg-green-100 dark:bg-green-900",
            textColor: "text-green-600"
        },
        {
            title: "Bin Đã Sử Dụng",
            value: occupiedBins.toString()||"",
            percentage: safeStacks.length > 0 ? Math.round((criticalStacks / safeStacks.length) * 100) : 0,
            icon: "mdi:package-variant",
            color: "orange",
            bgColor: "bg-orange-100 dark:bg-orange-900",
            textColor: "text-orange-600"
        },
        {
            title: "Stack Gần Đầy",
            value: criticalStacks.toString()||"",
            percentage: stacks.length > 0 ? Math.round((criticalStacks / stacks.length) * 100) : 0,
            icon: "mdi:alert-circle",
            color: "red",
            bgColor: "bg-red-100 dark:bg-red-900",
            textColor: "text-red-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewData.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-current" style={{ borderLeftColor: item.color === 'blue' ? '#3b82f6' : item.color === 'green' ? '#10b981' : item.color === 'orange' ? '#f59e0b' : '#ef4444' }}>
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