import { Card, CardBody, CardHeader, Progress, Divider, Button } from '@heroui/react';
import { MapPin, Package, CheckCircle } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const TaskSidebar = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thao tác nhanh
                    </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                    <Button
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/admin/task-assignments/create")}
                        startContent={<Package className="w-4 h-4" />}
                    >
                        Tạo nhiệm vụ mới
                    </Button>

                    {/*<Button*/}
                    {/*    color="secondary"*/}
                    {/*    variant="flat"*/}
                    {/*    fullWidth*/}
                    {/*    startContent={<Clock className="w-4 h-4" />}*/}
                    {/*>*/}
                    {/*    Xem lịch trình*/}
                    {/*</Button>*/}

                    <Button
                        color="success"
                        variant="flat"
                        fullWidth
                        startContent={<CheckCircle className="w-4 h-4" />}
                    >
                        Báo cáo hoàn thành
                    </Button>
                </CardBody>
            </Card>

            {/* Today's Tasks */}
            <Card className="shadow-lg">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Nhiệm vụ hôm nay
                    </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tổng nhiệm vụ:</span>
                        <span className="font-semibold">8</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Đã hoàn thành:</span>
                        <span className="font-semibold text-green-600">5</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Đang thực hiện:</span>
                        <span className="font-semibold text-blue-600">2</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Chờ xử lý:</span>
                        <span className="font-semibold text-orange-600">1</span>
                    </div>

                    <Divider />

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tiến độ hôm nay</span>
                            <span className="font-medium">62%</span>
                        </div>
                        <Progress value={62} color="success" className="h-2" />
                    </div>
                </CardBody>
            </Card>

            {/* Priority Tasks */}
            <Card className="shadow-lg">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Nhiệm vụ ưu tiên cao
                    </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-700 dark:text-red-300">
                                Kiểm kê kho A
                            </span>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400">
                            Hạn: 15:00 hôm nay
                        </p>
                    </div>

                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-700 dark:text-orange-300">
                                Picking đơn #1234
                            </span>
                        </div>
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                            Hạn: 17:00 hôm nay
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default TaskSidebar;