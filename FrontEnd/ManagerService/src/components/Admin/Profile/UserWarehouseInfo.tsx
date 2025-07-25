import { Building2, MapPin, Package, Calendar } from 'lucide-react';
import {Card, CardBody, CardHeader, Divider} from "@heroui/react";

interface UserWarehouseInfoProps {
    user: any;
}

const UserWarehouseInfo: React.FC<UserWarehouseInfoProps> = ({ user }) => {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-2">
                        <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thông tin kho
                    </h3>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kho làm việc</p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">
                            {user.warehouses?.warehouseName || 'Chưa phân công'}
                        </p>
                    </div>
                </div>

                {user.warehouses && (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ kho</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                    {user.warehouses.address || 'Chưa có địa chỉ'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Sức chứa</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.warehouses.capacity ?
                                        `${user.warehouses.capacity.toLocaleString()} m³` :
                                        'N/A'
                                    }
                                </p>
                            </div>
                        </div>
                    </>
                )}

                <Divider />

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tham gia</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                            {user.createdAt ?
                                new Date(user.createdAt).toLocaleDateString('vi-VN') :
                                'N/A'
                            }
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default UserWarehouseInfo;