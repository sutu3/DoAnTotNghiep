import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Card,
    CardBody,
    Chip,
    Tabs,
    Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {useState, useEffect, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import {InventoryWarehouseSelector, UnitSelector} from "@/Store/Selector";
import { MiddleGetInventoryWarehouseByProductId } from "@/Store/Thunk/InventoryWarehouseThunk";
import BinLocationSelector from "../BinLocationSelector";
import { useExportOrderStore } from "@/zustand/ExportOrderStore.tsx";
import UnitConversionTable from "@/pages/OrderExport/Component/Table/UnitConversionTable.tsx";
import {MiddleGetAllUnit} from "@/Store/Thunk/UnitThunk.tsx";
import {Unit} from "@/Store/Unit.tsx";
import {Product} from "@/Store/ProductSlice.tsx";
import {ExportItemCreateUI} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";

interface ExportItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product|null;
    warehouseId: string;
}

export default function ExportItemModal({ isOpen, onClose, product }: ExportItemModalProps) {
    const dispatch = useDispatch();
    const inventoryWarehouses = useSelector(InventoryWarehouseSelector);
    const { addItem } = useExportOrderStore();

    const [selectedBin, setSelectedBin] = useState<InventoryWarehouse|null>(null);
    const [quantity, setQuantity] = useState(1);
    const [baseQuantity, setBaseQuantity] = useState(1); // Thêm state để lưu số lượng gốc
    const [batchNumber, setBatchNumber] = useState("");
    const [unitConversions, setUnitConversions] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const units = useSelector(UnitSelector);
    const calculatedPrice = useMemo(() => {
        if (!product || !selectedUnit) return 0;

        const ratioToBase = selectedUnit?.ratioToBase || 1;

        return ( ratioToBase * product.price)/product?.unit?.ratioToBase;
    }, [quantity, selectedUnit, product, units]);
    const generateBatchNumber = (productId: string, binId: string) => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const productCode = productId.substring(0, 6).toUpperCase();
        const binCode = binId.substring(0, 3).toUpperCase();
        return `EXP-${productCode}-${binCode}-${date}`;
    };
    const handleBinSelect = (bin: any) => {
        setSelectedBin(bin);
        const availableQuantity = bin.quantity;
        setBaseQuantity(availableQuantity);
        setQuantity(availableQuantity);
        // Reset về đơn vị cơ sở khi chọn bin mới
        setSelectedUnit(product?.unit||null);
    };
    const handleUnitSelect = (unit: Unit) => {
        setSelectedUnit(unit);
        setQuantity(1)
        // Nếu chọn đơn vị cơ sở (ratioToBase = 1), sử dụng baseQuantity
        if (unit.ratioToBase === 1) {
            setQuantity(baseQuantity);
        }
    };

    // Reset form khi modal mở
    useEffect(() => {
        if (product && isOpen) {
            (dispatch as any)(MiddleGetInventoryWarehouseByProductId(product.productId));
            setSelectedBin(null);
            setQuantity(1);
            setBaseQuantity(1);
            setBatchNumber("");
            setSelectedUnit(product?.unit);
        }
    }, [product, isOpen, dispatch]);

    // Auto-generate batch number khi chọn bin
    useEffect(() => {
        if (product?.productId && selectedBin?.binDetails?.binId) {
            const autoBatch = generateBatchNumber(product.productId, selectedBin.binDetails.binId);
            setBatchNumber(autoBatch);
        }
    }, [product?.productId, selectedBin?.binDetails?.binId]);
    useEffect(() => {
        if (product?.unit?.groupUnit?.groupName) {
            const pageApiObj = { pageNumber: 0, pageSize: 8 };
            (dispatch as any)(MiddleGetAllUnit(pageApiObj, product.unit.groupUnit.groupName));
        }
    }, [product?.unit?.groupUnit?.groupName, dispatch]);

    useEffect(() => {
        if (units && units.length > 0) {
            setUnitConversions(units);
        }
    }, [units]);

    const handleAddToCart = () => {
        const maxQuantity=((selectedBin?.quantity||0)*(product?.unit?.ratioToBase||1)/(selectedUnit?.ratioToBase||1));
        console.log(quantity);
        if (!selectedBin || quantity > maxQuantity) return;
        const exportItem:ExportItemCreateUI = {
            product: product?.productId||"",
            bin: selectedBin.binDetails.binId,
            requestQuantity: quantity,
            batchNumber: batchNumber,
            itemId: "",
            productName: product?.productName||"",
            customer: "",
            customerName: "",
            unit: selectedUnit?.unitID||"",
            unitName: selectedUnit?.unitName||"",
            unitPrice: calculatedPrice,
            note:"",
            sku:product?.sku||"",
            maxQuantity: selectedBin.quantity,
        };

        addItem(exportItem);
        onClose();
    };

    return (
        <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Icon icon="mdi:export" className="text-2xl text-green-600" />
                    <div>
                        <h3 className="text-xl font-semibold">Thêm Sản Phẩm Xuất</h3>
                        <p className="text-sm text-gray-500">{product?.productName}</p>
                    </div>
                </ModalHeader>

                <ModalBody>
                    {/* Thêm Product Info Section */}
                    <div className="space-y-6">
                        {/* Product Information Card */}
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                            <CardBody>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product?.urlImageProduct}
                                            alt={product?.productName}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-product.png';
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                    {product?.productName}
                                                </h4>
                                                <p className="text-sm text-gray-500">SKU: {product?.sku}</p>
                                                <p className="text-sm text-gray-600">
                                                    Nhà cung cấp: {product?.supplier?.supplierName || "N/A"}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(product?.price || 0)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    per {product?.unit?.unitName}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stock Information */}
                                        <div className="mt-3 grid grid-cols-3 gap-3">
                                            <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                <div className="text-xs text-gray-500">Tồn kho hiện tại</div>
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {(product?.quantity || 0).toLocaleString()} {product?.unit?.unitName}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                <div className="text-xs text-gray-500">Khả dụng</div>
                                                <div className="text-sm font-semibold text-green-600">
                                                    {((product?.quantity || 0) - (product?.pendingApprovedExportQuantity || 0)).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                <div className="text-xs text-gray-500">Đang chờ xuất</div>
                                                <div className="text-sm font-semibold text-orange-600">
                                                    {(product?.pendingApprovedExportQuantity || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Tabs Section */}
                        <Tabs aria-label="Export options" className="w-full">
                            <Tab key="location" title={
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:map-marker" className="w-4 h-4" />
                                    <span>Vị trí & Số lượng</span>
                                </div>
                            }>
                                <div className="space-y-4 mt-4">
                                    <BinLocationSelector
                                        selectedUnit={selectedUnit}
                                        product={product}
                                        binLocations={inventoryWarehouses}
                                        selectedBin={selectedBin}
                                        onBinSelect={handleBinSelect}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="number"
                                            label={`Số lượng xuất (${selectedUnit?.unitName || product?.unit?.unitName})`}
                                            value={quantity.toString()}
                                            onValueChange={(value) => {
                                                const newQuantity = parseFloat(value) || 0;
                                                setQuantity(newQuantity);
                                                if (selectedUnit?.ratioToBase === 1) {
                                                    setBaseQuantity(newQuantity);
                                                } else {
                                                    setBaseQuantity(newQuantity / (selectedUnit?.ratioToBase || 1));
                                                }
                                            }}
                                            max={((selectedBin?.quantity||0)*(product?.unit?.ratioToBase||1)/(selectedUnit?.ratioToBase||1))}
                                            startContent={<Icon icon="mdi:package-variant" />}
                                            step="0.001"
                                            description={selectedBin ? `Tối đa: ${((selectedBin?.quantity||0)*(product?.unit?.ratioToBase||1)/(selectedUnit?.ratioToBase||1))}` : "Chọn bin để xem số lượng khả dụng"}
                                        />

                                        <Input
                                            label="Batch Number"
                                            value={batchNumber}
                                            onValueChange={setBatchNumber}
                                            startContent={<Icon icon="mdi:barcode" />}
                                            description="Tự động tạo khi chọn bin"
                                            isReadOnly
                                        />
                                    </div>

                                    {/* Conversion Info Card */}
                                    {selectedBin && (
                                        <Card className="bg-blue-50 border border-blue-200">
                                            <CardBody>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Icon icon="mdi:calculator" className="w-4 h-4 text-blue-600" />
                                                        <span className="font-medium text-blue-800">Thông tin quy đổi</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm">Số lượng có sẵn:</span>
                                                            <Chip color="primary" variant="flat" size="sm">
                                                                {selectedBin.quantity} {product?.unit?.unitName}
                                                            </Chip>
                                                        </div>

                                                        {selectedUnit && selectedUnit.unitID !== product?.unit?.unitID && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">Tương đương:</span>
                                                                <Chip color="success" variant="flat" size="sm">
                                                                    {(selectedBin.quantity * selectedUnit.ratioToBase).toFixed(3)} {selectedUnit.unitName}
                                                                </Chip>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                                        <span className="text-sm font-medium">Tổng giá trị xuất:</span>
                                                        <span className="font-bold text-green-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(calculatedPrice * quantity)}
                                        </span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            </Tab>

                            <Tab key="conversion" title={
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
                                    <span>Quy đổi đơn vị</span>
                                </div>
                            }>
                                <div className="mt-4">
                                    <UnitConversionTable
                                        conversions={unitConversions}
                                        baseQuantity={baseQuantity}
                                        baseUnit={product?.unit||null}
                                        selectedUnit={selectedUnit}
                                        onUnitSelect={handleUnitSelect}
                                    />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Hủy
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleAddToCart}
                        isDisabled={!selectedBin || quantity <= 0}
                        startContent={<Icon icon="mdi:cart-plus" />}
                    >
                        Thêm vào giỏ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}