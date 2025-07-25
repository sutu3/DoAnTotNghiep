import { Icon } from '@iconify/react';
import { Card, CardBody } from '@heroui/react';

const InventoryStatsOverview = () => {
    const statsData = [
        {
            title: "Tổng sản phẩm",
            value: "1,247",
            icon: "mdi:package-variant",
            color: "bg-blue-500",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "Sắp hết hàng",
            value: "23",
            icon: "mdi:alert-circle",
            color: "bg-orange-500",
            textColor: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20"
        },
        {
            title: "Hết hạn sử dụng",
            value: "8",
            icon: "mdi:calendar-alert",
            color: "bg-red-500",
            textColor: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20"
        },
        {
            title: "Tỷ lệ sử dụng kho",
            value: "78%",
            icon: "mdi:warehouse",
            color: "bg-green-500",
            textColor: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-700">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <Icon icon={stat.icon} className={`text-2xl ${stat.textColor}`} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default InventoryStatsOverview;