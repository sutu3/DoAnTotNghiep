import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TaskStatsCardsProps {
    stats: {
        pending: number;
        inProgress: number;
        completed: number;
        highPriority: number;
    };
}

const TaskStatsCards: React.FC<TaskStatsCardsProps> = ({ stats }) => {
    const statsData = [
        {
            icon: "mdi:clock-outline",
            label: "Đang chờ",
            value: stats.pending,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
            borderColor: "border-amber-200"
        },
        {
            icon: "mdi:progress-clock",
            label: "Đang thực hiện",
            value: stats.inProgress,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            borderColor: "border-blue-200"
        },
        {
            icon: "mdi:check-circle",
            label: "Hoàn thành",
            value: stats.completed,
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-200"
        },
        {
            icon: "mdi:alert-circle",
            label: "Ưu tiên cao",
            value: stats.highPriority,
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-200"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <Card
                    key={index}
                    className={`shadow-md border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
                >
                    <CardBody
                        className={`flex flex-row items-center gap-4 text-center ${stat.bgColor}`}
                    >
                        <div
                            className={`w-14 h-14 flex items-center justify-center rounded-full bg-white border-2 ${stat.borderColor} mb-4`}
                        >
                            <Icon icon={stat.icon} className={`text-3xl ${stat.color}`} />
                        </div>
                        <p className="text-base font-semibold text-gray-800 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default TaskStatsCards;
