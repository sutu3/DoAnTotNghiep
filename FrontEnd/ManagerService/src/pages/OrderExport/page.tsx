"use client";

import {useEffect, useState} from "react";
import {
    Button,
    Input,
    Textarea,
    Card,
    CardBody,
    CardHeader,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {ProductSelect} from "@/components/Admin/OrderExport/select/ProductSelect.tsx";
import ExportOrderSlice, {ExportItemCreateUI, OrderRequestExportCreate} from "@/Store/ExportOrderSlice.tsx";
import {SupplierSelect} from "@/components/Admin/OrderExport/select/SupplierSelect.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ExportItemCreateSelector} from "@/Store/Selector.tsx";
import TableUI from "@/components/Admin/OrderExport/Table/TableUI.tsx";
import SelectBinLocation from "@/components/Admin/OrderExport/select/SelectWarehouse.tsx";
import {BatchNumber} from "@/components/Admin/OrderExport/select/BatchNumber.tsx";
import {MiddleAddOrderImport} from "@/Store/Thunk/ImportOrderThunk.tsx";
import {MiddleAddOrderExport} from "@/Store/Thunk/ExportOrderThunk.tsx";
import OrderExportSlice from "@/Store/ExportOrderSlice.tsx";



export default function CreateExportOrderPage() {
    const dispatch = useDispatch();
    const items=useSelector(ExportItemCreateSelector)
    const [availableQuantity,setAvailableQuantity] = useState<number>(0)
    const [formData, setFormData] = useState<OrderRequestExportCreate>({
        warehouse: "",
        createByUser: "",
        customer: "",
        description: "",
        deliveryDate: "",
    });

    const [currentItem, setCurrentItem] = useState<ExportItemCreateUI>({
        batchNumber: "",
        bin: "",
        customer: "",
        customerName: "",
        itemId: "",
        note: "",
        product: "",
        productName: "",
        requestQuantity: 0,
        unit: "",
        unitName: "",
        unitPrice: 0
    });
    useEffect(() => {
        setFormData(prev=>({...prev,customer:currentItem.customer}));
    }, [currentItem.customer]);
    useEffect(() => {
        setAvailableQuantity(0);
    }, [currentItem.product]);
    const generateBatchNumber = (productId: string, binId: string) => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const productCode = productId.substring(0, 6).toUpperCase();
        const binCode = binId.substring(0, 3).toUpperCase();
        return `EXP-${productCode}-${binCode}-${date}`;
    };
    useEffect(() => {
        if (currentItem.product && currentItem.bin) {
            const autoBatch = generateBatchNumber(currentItem.product, currentItem.bin);
            setCurrentItem(prev => ({
                ...prev,
                batchNumber: autoBatch
            }));
        }
    }, [currentItem.bin]);
    const [loading, setLoading] = useState(false);

    const handleAddItem = () => {
        if (currentItem.product && currentItem.requestQuantity > 0) {
                dispatch(ExportOrderSlice.actions.setAddItemOrderCreate(currentItem));
            // Reset current item
            setCurrentItem({
                batchNumber: "",
                bin: "",
                customer: currentItem.customer,
                customerName: currentItem.customerName,
                itemId: "",
                note: "",
                product: "",
                productName: "",
                requestQuantity: 0,
                unit: "",
                unitName: "",
                unitPrice: 0
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Submit export order logic
            await (dispatch as any)(MiddleAddOrderExport(formData,items));
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch(OrderExportSlice.actions.setCleanItemOrderCreate());
            setFormData({createByUser: "", customer: "", deliveryDate: "", description: "", warehouse: ""})
            // Simulate API call
        } catch (error) {
            console.error("Error creating export order:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleBinSelect = (availableQty: number) => {
        setAvailableQuantity(availableQty);
    };

    const calculateTotal = () => {
        return items.reduce((total: number, item: { requestQuantity: number; unitPrice: number; }) =>
            total + (item.requestQuantity * item.unitPrice), 0
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-up" className="text-3xl text-orange-600" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Tạo Đơn Xuất Hàng
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tạo đơn xuất hàng mới cho khách hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Order Info & Add Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Information */}
                        <Card>
                            <CardHeader  aria-labelledby="Input">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thông Tin Đơn Xuất Hàng
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <SupplierSelect formData={currentItem} setFormData={setCurrentItem}/>

                                    <Input
                                        aria-labelledby="Input"
                                        type="date"
                                        label="Ngày giao hàng"
                                        value={formData.deliveryDate || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                                    />

                                </div>

                                <Textarea
                                    aria-labelledby="Input"
                                    label="Mô tả đơn hàng"
                                    placeholder="Nhập mô tả cho đơn xuất hàng..."
                                    value={formData.description}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, description: value }))
                                    }
                                />
                            </CardBody>
                        </Card>

                        {/* Add Item Form */}
                        <Card>
                            <CardHeader  aria-labelledby="Input">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thêm Sản Phẩm Xuất
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ProductSelect formData={currentItem} setFormData={setCurrentItem}/>
                                    <SelectBinLocation
                                        formData={currentItem}
                                        setFormData={setCurrentItem}
                                        onBinSelect={handleBinSelect}
                                    />


                                    <Input
                                        aria-labelledby="Input"
                                        type="number"
                                        label="Đơn giá (VNĐ)"
                                        placeholder="0"
                                        value={currentItem.unitPrice.toString()}
                                        onValueChange={(value) =>
                                            setCurrentItem(prev => ({
                                                ...prev,
                                                unitPrice: parseFloat(value) || 0
                                            }))
                                        }
                                        isReadOnly
                                    />
                                    <Input
                                        aria-labelledby="Input"
                                        type="number"
                                        label="Số lượng xuất"
                                        placeholder="0"
                                        disabled={availableQuantity==0}
                                        value={currentItem.requestQuantity.toString()}
                                        onValueChange={(value) =>
                                            setCurrentItem(prev => ({
                                                ...prev,
                                                requestQuantity: parseInt(value) || 0
                                            }))
                                        }
                                        description={availableQuantity > 0 ? `Có sẵn: ${availableQuantity} ${currentItem.unitName}` : "Chọn bin để xem số lượng có sẵn"}
                                        color={currentItem.requestQuantity > availableQuantity ? "danger" : "default"}
                                        errorMessage={currentItem.requestQuantity > availableQuantity ? "Số lượng xuất vượt quá số lượng có sẵn" : ""}
                                    />
                                    <BatchNumber formData={currentItem} setFormData={setCurrentItem}/>
                                </div>

                                <Button
                                    aria-labelledby="Input"
                                    color="primary"
                                    startContent={<Icon icon="mdi:plus" />}
                                    onClick={handleAddItem}
                                    isDisabled={
                                        !currentItem.product ||
                                        currentItem.requestQuantity <= 0
                                    }
                                >
                                    Thêm Sản Phẩm
                                </Button>
                            </CardBody>
                        </Card>
                        <TableUI/>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-6">
                        <Card  aria-labelledby="Input">
                            <CardHeader  aria-labelledby="Input">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Tóm Tắt Đơn Hàng
                                </h2>
                            </CardHeader>
                            <CardBody  aria-labelledby="Input" className="space-y-4">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Số lượng sản phẩm:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {items.length}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tổng giá trị:</span>
                                    <span className="font-semibold text-lg text-orange-600">
                                        {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>

                                <Divider />

                                <Button
                                    aria-labelledby="Input"
                                    color="success"
                                    fullWidth
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                    isDisabled={items.length === 0}
                                    startContent={<Icon icon="mdi:check-bold" />}
                                >
                                    {loading ? "Đang lưu..." : "Tạo Đơn Xuất"}
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}