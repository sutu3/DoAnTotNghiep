import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Progress,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {BinLocation, StackLocation} from "@/pages/ApproveOrderImport/page.tsx";
import {getBinStatusColor, getBinStatusText} from "@/Utils/statusHelpers.tsx";
import {ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";

interface ProductLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItem: ImportOrderItem | null;
    stackLocations: StackLocation[];
}

export default function ProductLocationModal({
                                                 isOpen,
                                                 onClose,
                                                 selectedItem,
                                                 stackLocations
                                             }: ProductLocationModalProps) {



    const getCapacityPercentage = (bin: BinLocation) => {
        return bin.currentQuantity ? (bin.currentQuantity / bin.capacity) * 100 : 0;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:map-marker" className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Vị Trí Sản Phẩm Trong Kho
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedItem?.product?.productName}
                            </p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody className="p-6">
                    {selectedItem && (
                        <div className="space-y-6">
                            {/* Product Info */}
                            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                                <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Icon icon="mdi:cube-outline" className="text-blue-600" />
                                        Thông Tin Sản Phẩm
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tên sản phẩm:</p>
                                            <p className="font-medium">{selectedItem?.product?.productName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Nhà cung cấp:</p>
                                            <p className="font-medium">{selectedItem?.supplier?.supplierName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Số lượng yêu cầu:</p>
                                            <Chip size="sm" variant="flat" color="primary">
                                                {selectedItem.requestQuantity} {selectedItem?.unit?.unitName}
                                            </Chip>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Đơn gi
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Đơn giá:</p>
                                                <p className="font-semibold text-green-600">
                                                    {selectedItem.costUnitBase.toLocaleString('vi-VN')} ₫
                                                </p>
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Stack Locations */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon icon="mdi:warehouse" className="text-blue-600" />
                                    Vị Trí Trong Kho ({stackLocations.length} stack)
                                </h4>

                                {stackLocations.map((stack) => (
                                    <Card key={stack.stackId} className="shadow-sm border border-gray-200 dark:border-gray-700">
                                        <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                                            <div className="flex justify-between items-center w-full">
                                                <h5 className="text-md font-semibold text-gray-700 dark:text-gray-200">
                                                    {stack.stackName}
                                                </h5>
                                                <div className="flex gap-2">
                                                    <Chip size="sm" variant="flat" color="primary">
                                                        {stack.availableBins}/{stack.totalBins} trống
                                                    </Chip>
                                                    <Chip size="sm" variant="flat" color="success">
                                                        {((stack.availableBins / stack.totalBins) * 100).toFixed(0)}% khả dụng
                                                    </Chip>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {stack.bins.map((bin) => (
                                                    <div
                                                        key={bin.binId}
                                                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-medium text-sm">{bin.binCode}</p>
                                                                <Chip
                                                                    size="sm"
                                                                    color={getBinStatusColor(bin.status)}
                                                                    variant="flat"
                                                                >
                                                                    {getBinStatusText(bin.status)}
                                                                </Chip>
                                                            </div>
                                                            <Icon
                                                                icon={bin.status === "EMPTY" ? "mdi:package-variant-closed" : "mdi:package-variant"}
                                                                className={`text-lg ${
                                                                    bin.status === "EMPTY" ? "text-gray-400" :
                                                                        bin.status === "FULL" ? "text-orange-500" : "text-red-500"
                                                                }`}
                                                            />
                                                        </div>

                                                        {bin.status !== "EMPTY" && bin.currentQuantity && (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-xs">
                                                                    <span>Sức chứa:</span>
                                                                    <span>{bin.currentQuantity}/{bin.capacity}</span>
                                                                </div>
                                                                <Progress
                                                                    value={getCapacityPercentage(bin)}
                                                                    color={getCapacityPercentage(bin) > 80 ? "danger" :
                                                                        getCapacityPercentage(bin) > 60 ? "warning" : "success"}
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>

                            {stackLocations.length === 0 && (
                                <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                                    <CardBody className="text-center py-8">
                                        <Icon icon="mdi:package-variant-closed" className="text-4xl text-gray-400 mb-2" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Không tìm thấy vị trí lưu trữ cho sản phẩm này
                                        </p>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                        )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onClick={onClose}>
                        Đóng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
);
}