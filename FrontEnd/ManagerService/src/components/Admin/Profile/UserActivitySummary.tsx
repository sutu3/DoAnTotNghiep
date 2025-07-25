import React from 'react';
import { Card, CardBody, CardHeader, Progress, Chip } from '@heroui/react';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface UserActivitySummaryProps {
    user: any;
}

const UserActivitySummary: React.FC<UserActivitySummaryProps> = ({ user }) => {
    // Mock data - trong thực tế sẽ lấy từ API
    const activityStats = {
        totalTasks: 45,
        completedTasks: 38,
        pendingTasks: 5,
        overdueTasks: 2,
        completionRate: 84
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                        <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Tóm tắt hoạt động
                    </h3>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                {/* Completion Rate */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</span>
                        <span className="font-medium">{activityStats.completionRate}%</span>
                    </div>
                    <Progress
                        value={activityStats.completionRate}
                        color="success"
                        className="h-2"
                    />
                </div>

                {/* Task Statistics */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</span>
                        </div>
                        <Chip color="success" variant="flat" size="sm">
                            {activityStats.completedTasks}
                        </Chip>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Đang thực hiện</span>
                        </div>
                        <Chip color="primary" variant="flat" size="sm">
                            {activityStats.pendingTasks}
                        </Chip>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Quá hạn</span>
                        </div>
                        <Chip color="danger" variant="flat" size="sm">
                            {activityStats.overdueTasks}
                        </Chip>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-3">
                        Hoạt động gần đây
                    </h4>
                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                        <p>• Hoàn thành nhiệm vụ kiểm kê kho A</p>
                        <p>• Cập nhật thông tin sản phẩm</p>
                        <p>• Xử lý đơn nhập hàng #1234</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default UserActivitySummary;