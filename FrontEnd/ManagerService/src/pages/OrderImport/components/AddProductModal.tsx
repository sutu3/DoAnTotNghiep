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
import {AlertTriangle, Calculator, Package} from "lucide-react";
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
                        <div
                            className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
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

                            {/* Thêm phần hiển thị tồn kho */}
                            <div className="min-w-[200px] space-y-2">
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-blue-600"/>
                                        <span className="text-sm font-medium text-gray-700">Tồn Kho Hiện Tại</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {(product.quantity || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">{product.unit?.unitName}</div>
                                </div>
                            </div>
                        </div>

                        {/* Thêm section mới để hiển thị thông tin chi tiết về tồn kho */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            {/* Tồn kho khả dụng */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Khả Dụng</span>
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                    {((product.quantity || 0) - (product.pendingApprovedExportQuantity || 0)).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Có thể xuất: {product.unit?.unitName}
                                </div>
                            </div>

                            {/* Đang chờ nhập */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Chờ Nhập</span>
                                </div>
                                <div className="text-xl font-bold text-orange-600">
                                    +{(product.pendingApprovedImportQuantity || 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Đang xử lý: {product.unit?.unitName}
                                </div>
                            </div>

                            {/* Mức tồn kho tối đa */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Giới Hạn Tối Đa</span>
                                </div>
                                <div className="text-xl font-bold text-red-600">
                                    {(product.maxStockLevel || 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Tối đa: {product.unit?.unitName}
                                </div>
                            </div>
                        </div>

                        {/* Progress bar hiển thị mức độ đầy kho */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-800">Mức Độ Đầy Kho</span>
                                <span className="text-sm text-blue-600">
            {Math.round(((product.quantity || 0) / (product.maxStockLevel || 1)) * 100)}%
        </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(((product.quantity || 0) / (product.maxStockLevel || 1)) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-blue-600 mt-1">
                                <span>Hiện tại: {(product.quantity || 0).toLocaleString()}</span>
                                <span>Tối đa: {(product.maxStockLevel || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Cải tiến phần input số lượng với validation thông minh */}
                        <div className="space-y-4">

                            {/* Quick select buttons cho số lượng phổ biến */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Chọn nhanh số lượng:</label>
                                <div className="flex gap-2 flex-wrap">
                                    {[10, 50, 100, 500].map((qty) => {
                                        const maxAllowed = (product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0);
                                        const isDisabled = qty > maxAllowed;

                                        return (
                                            <Button
                                                key={qty}
                                                size="sm"
                                                variant="bordered"
                                                isDisabled={isDisabled}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    requestQuantity: Math.min(qty, maxAllowed)
                                                }))}
                                                className={formData.requestQuantity === qty ? "border-blue-500 text-blue-600" : ""}
                                            >
                                                {qty.toLocaleString()}
                                            </Button>
                                        );
                                    })}
                                </div>
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
                                                    disabled={unit.ratioToBase*formData.requestQuantity > (product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0)}
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
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        const maxAllowed = (product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0);

                                        if (!isNaN(value)) {
                                            const validValue = Math.min(Math.max(value, 1), maxAllowed);
                                            setFormData(prev => ({
                                                ...prev,
                                                requestQuantity: validValue,
                                                unit:"",
                                                unitName: ""
                                            }));
                                        }
                                    }}
                                    min={0}
                                    disabled={((product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity)) < 0}
                                    max={(product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0)}
                                    isRequired
                                    description={`Tối đa có thể nhập: ${((product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0)).toLocaleString()} ${product.unit?.unitName}`}
                                    color={
                                        formData.requestQuantity > ((product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0))
                                            ? "danger"
                                            : "default"
                                    }
                                />
                                {formData.requestQuantity > ((product?.maxStockLevel || 0) - (product?.quantity || 0) - (product?.pendingApprovedImportQuantity || 0)) && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertTriangle className="w-4 h-4"/>
                                            <span className="text-sm font-medium">Vượt quá giới hạn tồn kho!</span>
                                        </div>
                                        <p className="text-xs text-red-500 mt-1">
                                            Số lượng nhập sẽ làm tồn kho vượt quá mức tối đa cho phép.
                                        </p>
                                    </div>
                                )}
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