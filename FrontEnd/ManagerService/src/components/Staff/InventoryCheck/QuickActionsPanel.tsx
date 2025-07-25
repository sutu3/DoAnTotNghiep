import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const QuickActionsPanel = () => {
    const quickActions = [
        {
            title: "Kiểm kê nhanh",
            icon: "mdi:clipboard-check",
            color: "primary",
            description: "Thực hiện kiểm kê sản phẩm"
        },
        {
            title: "Báo cáo sự cố",
            icon: "mdi:alert-circle",
            color: "warning",
            description: "Báo cáo hàng hỏng/mất"
        },
        {
            title: "Yêu cầu nhập hàng",
            icon: "mdi:plus-circle",
            color: "success",
            description: "Tạo yêu cầu bổ sung hàng"
        },
        {
            title: "In mã vạch",
            icon: "mdi:barcode",
            color: "secondary",
            description: "In nhãn cho sản phẩm"
        }
    ];

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:lightning-bolt" className="text-xl text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Thao Tác Nhanh
                    </h3>
                </div>
            </CardHeader>
            <CardBody className="space-y-3">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="flat"
                        color={action.color as any}
                        className="w-full justify-start h-auto p-4"
                        startContent={<Icon icon={action.icon} className="text-xl" />}
                    >
                        <div className="text-left">
                            <div className="font-semibold">{action.title}</div>
                            <div className="text-xs opacity-70">{action.description}</div>
                        </div>
                    </Button>
                ))}
            </CardBody>
        </Card>
    );
};

export default QuickActionsPanel;