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

    const [selectedBin, setSelectedBin] = useState<any>(null);
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

        // Nếu chọn đơn vị cơ sở (ratioToBase = 1), sử dụng baseQuantity
        if (unit.ratioToBase === 1) {
            setQuantity(baseQuantity);
        } else {
            // Quy đổi từ đơn vị cơ sở sang đơn vị được chọn
            const convertedQuantity = baseQuantity * unit.ratioToBase;
            setQuantity(parseFloat(convertedQuantity.toFixed(3)));
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
        if (!selectedBin || quantity <= 0) return;
        const exportItem:ExportItemCreateUI = {
            product: product?.productId||"",
            bin: selectedBin.binDetails.binId,
            requestQuantity: quantity,
            batchNumber: batchNumber || selectedBin.batchNumber,
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
                    <Tabs aria-label="Export options">
                        <Tab key="location" title="Vị trí & Số lượng">
                            <div className="space-y-4">
                                <BinLocationSelector
                                    selectedUnit={selectedUnit}
                                    product={product}
                                    binLocations={inventoryWarehouses}
                                    selectedBin={selectedBin}
                                    onBinSelect={handleBinSelect} // Sử dụng handler mới
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        label={`Số lượng xuất (${selectedUnit?.unitName || product?.unit?.unitName})`}
                                        value={quantity.toString()}
                                        onValueChange={(value) => {
                                            const newQuantity = parseFloat(value) || 0;
                                            console.log("newQuantity: "+newQuantity)
                                            console.log("selectedUnit:"+selectedUnit?.ratioToBase)
                                            setQuantity(newQuantity);
                                            // Cập nhật baseQuantity nếu đang ở đơn vị cơ sở
                                            if (selectedUnit?.ratioToBase === 1) {
                                                setBaseQuantity(newQuantity);
                                            } else {
                                                // Tính ngược về đơn vị cơ sở
                                                setBaseQuantity(newQuantity / (selectedUnit?.ratioToBase || 1));
                                            }
                                        }}
                                        max={(selectedBin?.quantity||0)*(selectedUnit?.ratioToBase || 0)}
                                        startContent={<Icon icon="mdi:package-variant" />}
                                        step="0.001"
                                    />
                                </div>

                                {/* Hiển thị thông tin quy đổi */}
                                {selectedBin && (
                                    <Card>
                                        <CardBody className="bg-blue-50">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span>Số lượng có sẵn:</span>
                                                    <Chip color="primary" variant="flat">
                                                        {selectedBin.quantity} {product?.unit?.unitName}
                                                    </Chip>
                                                </div>
                                                {selectedUnit && selectedUnit.unitID !== product?.unit?.unitID && (
                                                    <div className="flex justify-between items-center">
                                                        <span>Tương đương:</span>
                                                        <Chip color="success" variant="flat">
                                                            {(selectedBin.quantity * selectedUnit.ratioToBase).toFixed(3)} {selectedUnit.unitName}
                                                        </Chip>
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>
                        </Tab>

                        <Tab key="conversion" title="Quy đổi đơn vị">
                            <UnitConversionTable
                                conversions={unitConversions}
                                baseQuantity={baseQuantity}
                                baseUnit={product?.unit||null}
                                selectedUnit={selectedUnit}
                                onUnitSelect={handleUnitSelect}
                            />
                        </Tab>
                    </Tabs>
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