"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Package } from "lucide-react";
import { useImportOrderStore } from "@/zustand/importOrderStore.tsx";
import { MiddleAddOrderImport } from "@/pages/ExecuteImport/Store/ImportOrderThunk.tsx";
import { useDispatch } from "react-redux";
import SelectWarehouse from "@/components/Admin/OrderImport/select/SelectWarehouse.tsx";
import ProductTable from "./components/ProductTable";
import ImportCart from "./components/ImportCart";
import OrderSummary from "./components/OrderSummary";

export default function ImportOrderPage() {
    const { items, clearItems } = useImportOrderStore();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        warehouse: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleAddOrderImport(formData, items));
            clearItems();
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-600 rounded-xl p-3 shadow-lg">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Tạo Đơn Nhập Hàng
                            </h1>
                            <p className="text-gray-600">
                                Chọn sản phẩm và tạo yêu cầu nhập hàng mới
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warehouse Selection */}
                <Card className="mb-6 shadow-sm">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-800">Chọn Kho Hàng</h2>
                    </CardHeader>
                    <CardBody>
                        <SelectWarehouse formData={formData} setFormData={setFormData} />
                    </CardBody>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Product Table */}
                    <div className="xl:col-span-2">
                        {formData.warehouse && (
                            <ProductTable warehouseId={formData.warehouse} />
                        )}
                    </div>

                    {/* Cart & Summary */}
                    <div className="xl:col-span-1 space-y-6">
                        <ImportCart />
                        <OrderSummary
                            onSubmit={handleSubmit}
                            loading={loading}
                            disabled={items.length === 0 || !formData.warehouse}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}