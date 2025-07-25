import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Chip,
    Input,
    Divider,
    Avatar
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {useDispatch, useSelector} from 'react-redux';
import { MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {warehouseListSelector} from "@/Store/Selector.tsx";

interface Warehouse {
    warehouseId: string;
    warehouseName: string;
    warehouseAddress: string;
    isActive: boolean;
}

interface Props {
    productId?: string;
    linkedWarehouses: Warehouse[];
    setLinkedWarehouses: (warehouses: Warehouse[]) => void;
}

const ProductWarehouseManager: React.FC<Props> = ({
                                                      productId,
                                                      linkedWarehouses,
                                                      setLinkedWarehouses
                                                  }) => {
    console.log(linkedWarehouses)
    const warehouseList:Warehouse[]=useSelector(warehouseListSelector)
    const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        loadAllWarehouses();
    }, []);
    useEffect(() => {
        setAllWarehouses(warehouseList);
    }, [warehouseList]);
    const loadAllWarehouses = async () => {
        // API call để load tất cả warehouse
        // Sử dụng pattern tương tự như trong WarehouseThunk
        try {
             await (dispatch as any)(MiddleGetWarehouseByUser({pageSize:0,pageNumber:10}));
        } catch (error) {
            console.error('Failed to load warehouses:', error);
        }
    };

    const filteredWarehouses = allWarehouses.filter(warehouse =>
        warehouse.warehouseName.toLowerCase().includes(searchValue.toLowerCase()) ||
        warehouse.warehouseAddress.toLowerCase().includes(searchValue.toLowerCase())
    );

    const linkedWarehousesList = filteredWarehouses.filter((w: Warehouse) =>
        linkedWarehouses.some((lw: Warehouse) => lw.warehouseId == w.warehouseId)
    );

    const unlinkedWarehousesList = filteredWarehouses.filter(w =>
        !linkedWarehouses.some((lw: Warehouse) => lw.warehouseId == w.warehouseId)
    );

    const handleLinkWarehouse = async (warehouse: Warehouse) => {
        setLoading(true);
        try {
            // API call để link warehouse với product
            // await linkProductToWarehouse(productId, warehouseId);
            setLinkedWarehouses([...linkedWarehouses, warehouse]);
        } catch (error) {
            console.error('Failed to link warehouse:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkWarehouse = async (warehouse: Warehouse) => {
        setLoading(true);
        try {
            // API call để unlink warehouse khỏi product
            // await unlinkProductFromWarehouse(productId, warehouseId);
            setLinkedWarehouses(linkedWarehouses.filter(w => w.warehouseId !== warehouse?.warehouseId));        } catch (error) {
            console.error('Failed to unlink warehouse:', error);
        } finally {
            setLoading(false);
        }
    };

    const WarehouseCard = ({ warehouse, isLinked }: { warehouse: Warehouse; isLinked: boolean }) => (
        <Card className="mb-3">
            <CardBody className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            icon={<Icon icon="mdi:warehouse" />}
                            className="bg-blue-100 text-blue-600"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {warehouse.warehouseName}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {warehouse.warehouseAddress}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Chip
                            size="sm"
                            color={warehouse.isActive ? "success" : "warning"}
                            variant="flat"
                        >
                            {warehouse.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Chip>
                        <Button
                            size="sm"
                            color={isLinked ? "danger" : "primary"}
                            variant={isLinked ? "flat" : "solid"}
                            isLoading={loading}
                            onClick={() => isLinked ? handleUnlinkWarehouse(warehouse) : handleLinkWarehouse(warehouse)}
                            startContent={<Icon icon={isLinked ? "mdi:link-off" : "mdi:link"} />}
                        >
                            {isLinked ? "Hủy liên kết" : "Liên kết"}
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Search */}
            <Input
                isClearable
                placeholder="Tìm kiếm warehouse..."
                startContent={<Icon icon="mdi:magnify" />}
                value={searchValue}
                onClear={() => setSearchValue("")}
                onValueChange={setSearchValue}
            />

            {/* Warehouse đã liên kết */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon icon="mdi:link" className="text-2xl text-green-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Warehouse Đã Liên Kết
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {linkedWarehousesList.length} warehouse
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {linkedWarehousesList.length > 0 ? (
                        <div className="space-y-3">
                            {linkedWarehousesList.map((warehouse) => (
                                <WarehouseCard
                                    key={warehouse.warehouseId}
                                    warehouse={warehouse}
                                    isLinked={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Icon icon="mdi:link-off" className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Chưa có warehouse nào được liên kết</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Divider />

            {/* Warehouse chưa liên kết */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon icon="mdi:warehouse" className="text-2xl text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Warehouse Có Thể Liên Kết
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {unlinkedWarehousesList.length} warehouse
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {unlinkedWarehousesList.length > 0 ? (
                        <div className="space-y-3">
                            {unlinkedWarehousesList.map((warehouse) => (
                                <WarehouseCard
                                    key={warehouse.warehouseId}
                                    warehouse={warehouse}
                                    isLinked={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Icon icon="mdi:check-circle" className="text-4xl text-green-500 mx-auto mb-2" />
                            <p className="text-gray-500">
                                {searchValue ? "Không tìm thấy warehouse nào" : "Tất cả warehouse đã được liên kết"}
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <Button
                    color="success"
                    variant="flat"
                    startContent={<Icon icon="mdi:content-save" />}
                    onClick={() => {
                        // Save warehouse links
                        console.log('Saving warehouse links:', linkedWarehouses);
                    }}
                >
                    Lưu thay đổi
                </Button>

                <Button
                    color="warning"
                    variant="flat"
                    startContent={<Icon icon="mdi:refresh" />}
                    onClick={() => {
                        loadAllWarehouses();
                    }}
                >
                    Làm mới
                </Button>
            </div>
        </div>
    );
};

export default ProductWarehouseManager;