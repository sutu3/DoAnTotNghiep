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
import {Button} from "@heroui/button";
import {ImportOrderItem} from "@/Store/ImportOrder.tsx";
import {Icon} from "@iconify/react";

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
                                                   }: {
    isOpen: boolean;
    onClose: () => void;
    selectedItem: ImportOrderItem | null;
}) {
    const inventoryStats: ProductInventoryStats = {
        productId: "29b8281e-93e8-4689-89fb-fca1a9b239dc",
        productName: "Bếp Hồng Ngoại Kangaroo KG499N",
        currentStock: 120,  // số tồn kho hiện tại (giả lập)
        pendingOrders: 35,  // số lượng đang chờ nhập (giả lập)
        minimumStock: 50,   // tồn kho tối thiểu (giả lập)
        averagePrice: 115000, // giá trung bình nhập vào (giả lập)
        lastImportDate: "2025-07-05T10:15:00",  // lần nhập gần nhất (giả lập)
        recentSuppliers: [
            "Công ty TNHH Thiết Bị Điện Gia Dụng Minh Anh",
            "Công ty Cổ Phần Điện Máy Xanh"
        ],
        warehouseCapacity: {
            totalBins: 150,
            occupiedBins: 110,
            availableBins: 40
        },
        suggestedLocations: [
            {
                stackName: "Stack A1",
                binCode: "BIN-001",
                reason: "Vị trí gần lối vào, dễ xuất hàng"
            },
            {
                stackName: "Stack B2",
                binCode: "BIN-015",
                reason: "Khoảng trống phù hợp và an toàn"
            }
        ]
    };
    console.log(inventoryStats);
    console.log(selectedItem);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Icon icon="mdi:chart-box" className="text-2xl text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Thống Kê Sản Phẩm Trong Kho
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedItem?.product?.productName || inventoryStats.productName}
                            </p>
                        </div>
                        <Chip
                            color={inventoryStats.currentStock < inventoryStats.minimumStock ? "danger" : "success"}
                            variant="flat"
                            className="font-semibold"
                        >
                            {inventoryStats.currentStock < inventoryStats.minimumStock ? "Thiếu hàng" : "Đủ hàng"}
                        </Chip>
                    </div>
                </ModalHeader>

                <ModalBody className="p-6">
                    {inventoryStats && (
                        <div className="space-y-6">
                            {/* Existing grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Inventory - Enhanced */}
                                <Card className="border-l-4 border-l-blue-500">
                                    <CardHeader className="pb-2">
                                        <h4 className="flex items-center gap-2 text-lg font-semibold">
                                            <Icon icon="mdi:warehouse" className="text-blue-600" />
                                            Tồn Kho Hiện Tại
                                        </h4>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Số lượng hiện có:</span>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    className="font-semibold"
                                                >
                                                    {inventoryStats.currentStock.toLocaleString()} {selectedItem?.unit?.unitName}
                                                </Chip>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Đang chờ nhập:</span>
                                                <Chip color="warning" variant="flat">
                                                    {inventoryStats.pendingOrders.toLocaleString()}
                                                </Chip>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Mức tối thiểu:</span>
                                                <Chip
                                                    color={inventoryStats.currentStock < inventoryStats.minimumStock ? "danger" : "success"}
                                                    variant="flat"
                                                >
                                                    {inventoryStats.minimumStock.toLocaleString()}
                                                </Chip>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Giá trung bình:</span>
                                                <span className="font-semibold text-green-600">
                                    {inventoryStats.averagePrice.toLocaleString('vi-VN')} ₫
                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Warehouse Capacity - Enhanced */}
                                <Card className="border-l-4 border-l-orange-500">
                                    <CardHeader className="pb-2">
                                        <h4 className="flex items-center gap-2 text-lg font-semibold">
                                            <Icon icon="mdi:cube-outline" className="text-orange-600" />
                                            Sức Chứa Kho
                                        </h4>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <div className="space-y-4">
                                            <Progress
                                                value={(inventoryStats.warehouseCapacity.occupiedBins / inventoryStats.warehouseCapacity.totalBins) * 100}
                                                color="warning"
                                                label="Tỷ lệ sử dụng"
                                                showValueLabel={true}
                                                className="max-w-full"
                                            />
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div className="text-center">
                                                    <div className="font-semibold text-blue-600">
                                                        {inventoryStats.warehouseCapacity.totalBins}
                                                    </div>
                                                    <div className="text-gray-500">Tổng bin</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-orange-600">
                                                        {inventoryStats.warehouseCapacity.occupiedBins}
                                                    </div>
                                                    <div className="text-gray-500">Đã sử dụng</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-green-600">
                                                        {inventoryStats.warehouseCapacity.availableBins}
                                                    </div>
                                                    <div className="text-gray-500">Còn trống</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* New sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Recent Suppliers */}
                                <Card className="border-l-4 border-l-purple-500">
                                    <CardHeader className="pb-2">
                                        <h4 className="flex items-center gap-2 text-lg font-semibold">
                                            <Icon icon="mdi:truck" className="text-purple-600" />
                                            Nhà Cung Cấp Gần Đây
                                        </h4>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <div className="space-y-2">
                                            {inventoryStats.recentSuppliers.map((supplier, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <Icon icon="mdi:factory" className="text-purple-500 text-sm" />
                                                    <span className="text-sm">{supplier}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>


                            </div>

                            {/* Last Import Info */}
                            <Card className="border-l-4 border-l-indigo-500">
                                <CardHeader className="pb-2">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold">
                                        <Icon icon="mdi:clock-outline" className="text-indigo-600" />
                                        Thông Tin Nhập Hàng
                                    </h4>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Lần nhập gần nhất:</span>
                                        <Chip color="secondary" variant="flat">
                                            {new Date(inventoryStats.lastImportDate).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Chip>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-500">
                            Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="flat"
                                color="primary"
                                startContent={<Icon icon="mdi:refresh" />}
                            >
                                Làm mới
                            </Button>
                            <Button variant="light" onClick={onClose}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}