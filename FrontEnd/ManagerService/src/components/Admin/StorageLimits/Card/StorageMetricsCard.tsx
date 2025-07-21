import React from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';

interface StorageMetricsCardProps {
    title: string;
    value: string;
    percentage: number;
    icon: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    color: 'blue' | 'green' | 'orange' | 'red';
}

const StorageMetricsCard: React.FC<StorageMetricsCardProps> = ({
                                                                   title,
                                                                   value,
                                                                   percentage,
                                                                   icon,
                                                                   trend,
                                                                   trendValue,
                                                                   color
                                                               }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900',
            text: 'text-blue-600',
            border: 'border-blue-500'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-600',
            border: 'border-green-500'
        },
        orange: {
            bg: 'bg-orange-100 dark:bg-orange-900',
            text: 'text-orange-600',
            border: 'border-orange-500'
        },
        red: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-600',
            border: 'border-red-500'
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return 'mdi:trending-up';
            case 'down': return 'mdi:trending-down';
            default: return 'mdi:trending-neutral';
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <Card className={`border-l-4 ${colorClasses[color].border}`}>
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                    </div>
                    <div className={`p-3 ${colorClasses[color].bg} rounded-full`}>
                        <Icon icon={icon} className={`text-2xl ${colorClasses[color].text}`} />
                    </div>
                </div>

                <div className="space-y-3">
                    <Progress
                        value={percentage}
                        color={color as any}
                        size="sm"
                        className="w-full"
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {percentage}% sử dụng
                        </span>
                        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                            <Icon icon={getTrendIcon()} className="text-sm" />
                            <span>{trendValue}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default StorageMetricsCard;