import React from 'react';
import { Card, CardHeader, CardBody, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface StorageAlertsPanelProps {
    stacks: any[];
}

const StorageAlertsPanel: React.FC<StorageAlertsPanelProps> = ({ stacks }) => {
    const generateAlerts = () => {
        const alerts = [];

        stacks?.forEach(stack => {
            const totalBins = stack.bin?.length || 0;
            const emptyBins = stack.bin?.filter((bin: any) => bin.status === "EMPTY").length || 0;
            const percentage = totalBins > 0 ? Math.round(((totalBins - emptyBins) / totalBins) * 100) : 0;

            if (percentage > 90) {
                alerts.push({
                    type: 'critical',
                    title: 'Stack Gần Đầy',
                    message: `${stack.stackName || `Stack ${stack.stackId}`} đã sử dụng ${percentage}%`,
                    warehouse: stack.warehouse?.warehouseName || "N/A",
                    icon: 'mdi:alert-circle',
                    time: 'Vừa xong'
                });
            } else if (percentage > 70) {
                alerts.push({
                    type: 'warning',
                    title: 'Cảnh Báo Sức Chứa',
                    message: `${stack.stackName || `Stack ${stack.stackId}`} đã sử dụng ${percentage}%`,
                    warehouse: stack.warehouse?.warehouseName || "N/A",
                    icon: 'mdi:alert',
                    time: '5 phút trước'
                });
            }
        });

        // Thêm một số cảnh báo mẫu khác
        if (alerts.length < 3) {
            alerts.push({
                type: 'info',
                title: 'Kiểm Tra Định Kỳ',
                message: 'Đã đến thời gian kiểm tra sức chứa kho',
                warehouse: 'Tất cả kho',
                icon: 'mdi:information',
                time: '1 giờ trước'
            });
        }

        return alerts.slice(0, 5); // Giới hạn 5 cảnh báo
    };

    const alerts = generateAlerts();

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'critical': return 'danger';
            case 'warning': return 'warning';
            case 'info': return 'primary';
            default: return 'default';
        }
    };

    const getAlertBgColor = (type: string) => {
        switch (type) {
            case 'critical': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:bell-alert" className="text-2xl text-red-600" />
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Cảnh Báo Lưu Trữ
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {alerts.length} cảnh báo mới
                            </p>
                        </div>
                    </div>
                    <Button size="sm" variant="light" color="primary">
                        Xem tất cả
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {alerts.length > 0 ? (
                        alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon
                                        icon={alert.icon}
                                        className={`text-xl mt-0.5 ${
                                            alert.type === 'critical' ? 'text-red-600' :
                                                alert.type === 'warning' ? 'text-yellow-600' :
                                                    'text-blue-600'
                                        }`}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {alert.title}
                                            </h4>
                                            <Chip
                                                size="sm"
                                                color={getAlertColor(alert.type) as any}
                                                variant="flat"
                                            >
                                                {alert.type === 'critical' ? 'Khẩn cấp' :
                                                    alert.type === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                                            </Chip>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {alert.message}
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Kho: {alert.warehouse}</span>
                                            <span>{alert.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Icon icon="mdi:check-circle" className="text-4xl text-green-500 mb-2" />
                            <p className="text-gray-600 dark:text-gray-400">
                                Không có cảnh báo nào
                            </p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default StorageAlertsPanel;