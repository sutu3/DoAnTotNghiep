import {
    Card,
    CardBody,
    CardHeader,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Progress
} from "@heroui/react";
import { Icon } from "lucide-react";
import {Button} from "@heroui/button";
import {ImportOrderItem} from "@/Store/ImportOrder.tsx";

export interface ProductInventoryStats {
    productId: string;
    productName: string;
    currentStock: number;
    pendingOrders: number;
    minimumStock: number;
    averagePrice: number;
    lastImportDate: string;
    recentSuppliers: string[];
    warehouseCapacity: {
        totalBins: number;
        occupiedBins: number;
        availableBins: number;
    };
    suggestedLocations: {
        stackName: string;
        binCode: string;
        reason: string;
    }[];
}

export default function ProductInventoryStatsModal({
                                                       isOpen,
                                                       onClose,
                                                       selectedItem,
                                                       inventoryStats
                                                   }: {
    isOpen: boolean;
    onClose: () => void;
    selectedItem: ImportOrderItem | null;
    inventoryStats: ProductInventoryStats | null;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:chart-box" className="text-2xl text-green-600" />
                        <div>
                            <h3 className="text-xl font-bold">Thống Kê Sản Phẩm Trong Kho</h3>
                            <p className="text-sm text-gray-600">{selectedItem?.productName}</p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody className="p-6">
                    {inventoryStats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Inventory */}
                            <Card>
                                <CardHeader>
                                    <h4 className="flex items-center gap-2">
                                        <Icon icon="mdi:warehouse" className="text-blue-600" />
                                        Tồn Kho Hiện Tại
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Số lượng hiện có:</span>
                                            <Chip color="primary" variant="flat">
                                                {inventoryStats.currentStock} {selectedItem?.unitName}
                                            </Chip>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Đang chờ nhập:</span>
                                            <span>{inventoryStats.pendingOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mức tối thiểu:</span>
                                            <span className={inventoryStats.currentStock < inventoryStats.minimumStock ? "text-red-500" : ""}>
                                                {inventoryStats.minimumStock}
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Warehouse Capacity */}
                            <Card>
                                <CardHeader>
                                    <h4 className="flex items-center gap-2">
                                        <Icon icon="mdi:cube-outline" className="text-orange-600" />
                                        Sức Chứa Kho
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3">
                                        <Progress
                                            value={(inventoryStats.warehouseCapacity.occupiedBins / inventoryStats.warehouseCapacity.totalBins) * 100}
                                            color="warning"
                                            label="Tỷ lệ sử dụng"
                                        />
                                        <div className="text-sm text-gray-600">
                                            {inventoryStats.warehouseCapacity.occupiedBins}/{inventoryStats.warehouseCapacity.totalBins} bin đã sử dụng
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </ModalBody>
                inventoryStats
                <ModalFooter>
                    <Button variant="light" onClick={onClose}>Đóng</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}