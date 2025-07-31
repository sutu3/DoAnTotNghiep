import {
    Avatar,
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    Textarea
} from "@heroui/react";
import {Calculator, Package} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {UnitSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllUnit} from "@/Store/Thunk/UnitThunk.tsx";
import {useImportOrderStore} from "@/zustand/importOrderStore.tsx";
import {useEffect, useMemo, useState} from "react";
import {setUnitList, Unit} from "@/Store/Unit.tsx";
import {Product} from "@/Store/ProductSlice.tsx";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const AddProductModal: React.FC<AddProductModalProps> = ({isOpen, onClose, product}) => {
    const [formData, setFormData] = useState({
        unit: "",
        unitName: "",
        requestQuantity: 1,
        note: "",
        expiryDate: "" // Thêm field này
    });

    const units = useSelector(UnitSelector) || [];
    const {addItem} = useImportOrderStore();
    const dispatch = useDispatch();

    // Load units when product changes
    useEffect(() => {
        dispatch(setUnitList([]))
        if (product?.unit?.groupUnit?.groupName) {
            const pageApiObj = {pageNumber: 0, pageSize: 20};
            (dispatch as any)(MiddleGetAllUnit(pageApiObj, product.unit.groupUnit.groupName));
        }
    }, [product, dispatch]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen && product) {
            setFormData({
                unit: product.unit?.unitID || "",
                unitName: product.unit?.unitName || "",
                requestQuantity: 1,
                note: "",
                expiryDate: "" // Reset expiryDate
            });
        }
    }, [isOpen, product]);

    // Calculate total price with unit conversion
    const calculatedPrice = useMemo(() => {
        if (!product || !formData.unit) return 0;

        const selectedUnit = units.find((u: any) => u.unitID === formData.unit);
        const ratioToBase = selectedUnit?.ratioToBase || 1;

        return (formData.requestQuantity * ratioToBase * product.price)/product?.unit?.ratioToBase;
    }, [formData.requestQuantity, formData.unit, product, units]);

    const handleUnitChange = (unitId: string) => {
        const selectedUnit = units.find((u: any) => u.unitID === unitId);
        if (selectedUnit) {
            setFormData(prev => ({
                ...prev,
                unit: unitId,
                unitName: selectedUnit.unitName
            }));
        }
    };

    const handleAddToCart = () => {
        if (!product || !formData.unit || formData.requestQuantity <= 0||formData?.expiryDate=="") return;

        const selectedUnit = units.find((u: any) => u.unitID === formData.unit);
        const ratioToBase = selectedUnit?.ratioToBase || 1;

        const cartItem = {
            itemId: `${product.productId}-${Date.now()}`,
            product: product.productId,
            productName: product.productName,
            supplier: product.supplier?.supplierId || "",
            supplierName: product.supplier?.supplierName || "",
            unit: formData.unit,
            unitName: selectedUnit.unitName,
            requestQuantity: formData.requestQuantity,
            costUnitBase: calculatedPrice / formData.requestQuantity,
            note: formData.note,
            expiryDate: formData.expiryDate,
            ratioToBase: ratioToBase
        };

        addItem(cartItem);
        onClose();

        // Reset form
        setFormData({
            unit: product.unit?.unitID || "",
            unitName: product.unit?.unitName || "",
            requestQuantity: 1,
            note: "",
            expiryDate: ""
        });
    };

    if (!product) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            portalContainer={document.body} // Thêm prop này
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-blue-600"/>
                    <div>
                        <h3 className="text-xl font-semibold">Thêm Sản Phẩm Vào Đơn Hàng</h3>
                        <p className="text-sm text-gray-500">{product.productName}</p>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-6">
                        {/* Product Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar
                                src={product.urlImageProduct}
                                size="lg"
                                fallback={<Package className="w-8 h-8"/>}
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{product.productName}</h4>
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                <p className="text-sm text-gray-500">
                                    Nhà cung cấp: {product.supplier?.supplierName || "N/A"}
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                    Giá gốc: {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(product.price)} / {product.unit?.unitName}
                                </p>
                            </div>
                        </div>

                        <Divider/>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đơn vị nhập</label>
                                <Tabs aria-label="Unit categories" size="sm">
                                    <Tab key="basic" title="Cơ bản">
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {units.filter((u: Unit) => u.ratioToBase === product?.unit?.ratioToBase).map((unit: any) => (
                                                <Button
                                                    key={unit.unitID}
                                                    variant={formData.unit === unit.unitID ? "solid" : "bordered"}
                                                    color={formData.unit === unit.unitID ? "primary" : "default"}
                                                    onClick={() => handleUnitChange(unit.unitID)}
                                                    size="sm"
                                                    className="h-auto py-2"
                                                >
                                                    {unit.unitName}
                                                </Button>
                                            ))}
                                        </div>
                                    </Tab>
                                    <Tab key="converted" title="Quy đổi">
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {units.filter((u: Unit) => u.ratioToBase !== 1&&u.ratioToBase>=product?.unit?.ratioToBase).map((unit: Unit) => (
                                                <Button
                                                    key={unit.unitID}
                                                    variant={formData.unit === unit.unitID ? "solid" : "bordered"}
                                                    color={formData.unit === unit.unitID ? "primary" : "default"}
                                                    onClick={() => handleUnitChange(unit.unitID)}
                                                    size="sm"
                                                    className="w-full justify-between h-auto py-2"
                                                >
                                                    <span>{unit.unitName}</span>
                                                    <span className="text-xs opacity-70">
                1:{unit.ratioToBase}
            </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    type="number"
                                    label="Số lượng nhập"
                                    placeholder="Nhập số lượng"
                                    value={formData.requestQuantity.toString()}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        requestQuantity: parseInt(e.target.value) || 1
                                    }))}
                                    min={1}
                                    isRequired
                                />

                                {/* Thêm Input cho expiryDate */}
                                <Input
                                    type="date"
                                    label="Ngày hết hạn"
                                    placeholder="Chọn ngày hết hạn"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        expiryDate: e.target.value
                                    }))}
                                    description="Để trống nếu sản phẩm không có hạn sử dụng"
                                />
                            </div>
                        </div>

                        {/* Price Calculation */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calculator className="w-5 h-5 text-blue-600"/>
                                <h4 className="font-semibold text-blue-800">Tính Toán Giá</h4>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Số lượng:</span>
                                    <span className="font-medium">
                                        {formData.requestQuantity} {formData.unitName}
                                    </span>
                                </div>

                                {units.find((u: Unit) => u.unitID === formData.unit)?.ratioToBase !== 1 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Quy đổi:</span>
                                        <span>
                                            {formData.requestQuantity} × {units.find((u: Unit) => u.unitID === formData.unit)?.ratioToBase || 1}/{product?.unit?.ratioToBase} = {' '}
                                            {formData.requestQuantity * (units.find((u: Unit) => u.unitID === formData.unit)?.ratioToBase || 1)/product?.unit?.ratioToBase} {product.unit?.unitName}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Đơn giá gốc:</span>
                                    <span>{new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price)} / {product.unit?.unitName}</span>
                                </div>
                                {formData.expiryDate && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ngày hết hạn:</span>
                                        <span className="font-medium">
                    {new Date(formData.expiryDate).toLocaleDateString('vi-VN')}
                </span>
                                    </div>
                                )}

                                <Divider/>

                                <div className="flex justify-between text-lg font-bold text-blue-700">
                                    <span>Tổng tiền:</span>
                                    <span>{new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(calculatedPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Textarea
                            label="Mô tả / Ghi chú"
                            placeholder="Nhập mô tả cho sản phẩm này..."
                            value={formData.note}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                note: e.target.value
                            }))}
                            rows={3}
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Hủy
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleAddToCart}
                        isDisabled={!formData.unit || formData.requestQuantity <= 0}
                    >
                        Hoàn Tất - Thêm Vào Giỏ Hàng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddProductModal;