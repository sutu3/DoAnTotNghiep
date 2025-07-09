"use client";

import  { useState} from "react";
import {
    Button,
    Input,
    Textarea,
    Card,
    CardBody,
    CardHeader,
    Divider
} from "@heroui/react";
import {Icon} from "@iconify/react";
import {ImportItemCreate, OrderRequestImportCreate} from "@/Store/ImportOrder.tsx";
import SelectWarehouse from "@/components/Admin/OrderImport/select/SelectWarehouse.tsx";
import {ProductSelect} from "@/components/Admin/OrderImport/select/ProductSelect.tsx";
import {SupplierSelect} from "@/components/Admin/OrderImport/select/SupplierSelect.tsx";
import {UnitSelect} from "@/components/Admin/OrderImport/select/UnitSelect.tsx";
import TableUI from "@/components/Admin/OrderImport/Table/TableUI.tsx";
import {useImportOrderStore} from "@/zustand/importOrderStore.tsx";
import {MiddleAddOrder} from "@/Store/Thunk/ImportOrderThunk.tsx";
import {useDispatch} from "react-redux";



export default function OrderRequestImportForm() {
    const {items,addItem,clearItems}=useImportOrderStore();
    const dispatch=useDispatch();
    const [formData, setFormData] = useState<OrderRequestImportCreate>({
        warehouse: "",
        createByUser: "",
        description: ""
    });
    const [currentItem, setCurrentItem] = useState<ImportItemCreate>({
        itemId: "",
        product: "",
        productName: "",
        supplier: "",
        supplierName: "",
        unit: "",
        unitName: "",
        requestQuantity: 0,
        costUnitBase: 0,
        note: "",
        expiryDate: ""
    });
    console.log("Item: "+JSON.stringify(currentItem));
    const [loading, setLoading] = useState(false);

    const handleAddItem = () => {
        if (currentItem.product && currentItem.supplier && currentItem.requestQuantity > 0) {
           addItem(currentItem);
            setCurrentItem({
                itemId: "",
                product: "",
                productName: "",
                supplier: "",
                supplierName: "",
                unit: "",
                unitName: "",
                requestQuantity: 0,
                costUnitBase: 0,
                note: "",
                expiryDate: ""
            });
        }
    };
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleAddOrder(formData,items));
            clearItems();

        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.requestQuantity * item.costUnitBase), 0);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-down" className="text-3xl text-blue-600"/>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tạo Đơn Yêu Cầu Nhập Hàng</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Tạo yêu cầu nhập hàng mới cho kho</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thông Tin Đơn
                                    Hàng</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <SelectWarehouse formData={formData} setFormData={setFormData}/>

                                <Textarea
                                    label="Mô tả đơn hàng"
                                    placeholder="Nhập mô tả cho đơn nhập hàng..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thêm Sản Phẩm</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ProductSelect formData={currentItem} setFormData={setCurrentItem}/>

                                    <SupplierSelect formData={currentItem} setFormData={setCurrentItem}/>

                                    <UnitSelect formData={currentItem} setFormData={setCurrentItem}/>

                                    <Input
                                        aria-labelledby="Input"
                                        type="number"
                                        label="Số lượng"
                                        placeholder="0"
                                        value={currentItem.requestQuantity.toString()}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, requestQuantity: parseInt(e.target.value) || 0 }))}
                                    />

                                    <Input
                                        type="number"
                                        aria-labelledby="Input"
                                        label="Giá nhập (VNĐ)"
                                        placeholder="0"
                                        value={currentItem.costUnitBase.toString()}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, costUnitBase: parseFloat(e.target.value) || 0 }))}
                                    />

                                    <Input
                                        type="date"
                                        aria-labelledby="Input"
                                        label="Ngày hết hạn"
                                        value={currentItem.expiryDate || ""}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                                    />
                                </div>

                                <Textarea
                                    label="Ghi chú"
                                    aria-labelledby="Input"
                                    placeholder="Ghi chú cho sản phẩm..."
                                    value={currentItem.note || ""}
                                    onChange={(e) => setCurrentItem(prev => ({ ...prev, note: e.target.value }))}
                                />

                                <Button
                                    color="primary"
                                    aria-labelledby="Input"
                                    startContent={<Icon icon="mdi:plus" />}
                                    onClick={(e) => { e.preventDefault(); handleAddItem(); }}
                                    isDisabled={!currentItem.product || !currentItem.supplier || currentItem.requestQuantity <= 0}
                                >
                                    Thêm Sản Phẩm
                                </Button>
                            </CardBody>
                        </Card>

                        {items.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Danh Sách Sản Phẩm ({items.length})</h2>
                                </CardHeader>
                                <CardBody>
                                    <TableUI />

                                    <Divider className="my-4" />
                                    <div className="text-right font-semibold text-lg text-gray-700 dark:text-gray-200">
                                        Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-4 items-end">
                        <Card>
                            <CardBody>
                                <Button
                                    color="primary"
                                    className="w-full"
                                    isLoading={loading}
                                    onClick={handleSubmit}
                                    isDisabled={items.length === 0 || !formData.warehouse}
                                >
                                    Gửi Yêu Cầu Nhập Hàng
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
