import React from 'react';
import {Card, CardHeader, CardBody, Chip, Button, Spinner} from '@heroui/react';
import { Icon } from '@iconify/react';
import {StorageAlertResponse} from "@/Hooks/useStorageStats.ts";

interface StorageAlertsPanelProps {
    alerts?: StorageAlertResponse[];
    loading?: boolean;
}

const StorageAlertsPanel: React.FC<StorageAlertsPanelProps> = ({
                                                                   alerts = [],
                                                                   loading
                                                               }) => {
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

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'critical': return 'mdi:alert-circle';
            case 'warning': return 'mdi:alert';
            case 'info': return 'mdi:information';
            default: return 'mdi:alert';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:bell-alert" className="text-2xl text-red-600" />
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Cảnh Báo Lưu Trữ
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Đang tải...
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
                                key={`${alert.stackId}-${index}`}
                                className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon
                                        icon={getAlertIcon(alert.type)}
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
                                                {alert.severity === 'HIGH' ? 'Khẩn cấp' :
                                                    alert.severity === 'MEDIUM' ? 'Cảnh báo' : 'Thông tin'}
                                            </Chip>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {alert.message}
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Stack: {alert.stackName}</span>
                                            <span>{formatTimeAgo(alert.createdAt)}</span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            Sử dụng: {alert.utilizationPercentage.toFixed(1)}%
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