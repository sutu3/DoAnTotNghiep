import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { useSelector } from 'react-redux';

const InventoryCheckHeader = () => {
    // const currentUser = useSelector((state: any) => state.auth.user);
    const currentWarehouse = useSelector((state: any) => state.warehouse.selectedWarehouse);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                        <Icon icon="mdi:clipboard-check" className="text-3xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                            Kiểm Tra Tồn Kho
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Theo dõi và quản lý hàng tồn kho - {currentWarehouse?.warehouseName || 'Tất cả kho'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Icon icon="mdi:account" className="text-sm text-gray-500" />
                            <span className="text-sm text-gray-500">
                                Nhân viên: { 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="mdi:refresh" />}
                        size="sm"
                    >
                        Làm mới
                    </Button>
                    <Button
                        color="secondary"
                        variant="flat"
                        startContent={<Icon icon="mdi:download" />}
                        size="sm"
                    >
                        Xuất báo cáo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InventoryCheckHeader;