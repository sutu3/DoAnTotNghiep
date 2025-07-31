"use client";

import { useState } from "react";
import { MiddleAddOrderExport } from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import { useDispatch } from "react-redux";
import { useExportOrderStore } from "@/zustand/ExportOrderStore";
import ExportOrderHeader from "./Component/ExportOrderHeader";
import WarehouseSelectionCard from "./Component/WarehouseSelectionCard";
import ProductExportTable from "./Component/Table/ProductExportTable";
import ExportCart from "@/pages/OrderExport/Component/Cart/ExportCart.tsx";
import ExportOrderSummary from "./Component/ExportOrderSummary";
import { OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

export default function ExportOrderPage() {
    const { items, clearItems } = useExportOrderStore();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<OrderRequestExportCreate>({
        warehouse: "",
        customer: "",
        deliveryDate: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
             await (dispatch as any)(MiddleAddOrderExport(formData, items));
            clearItems();
            setFormData({
                warehouse: "",
                customer: "",
                deliveryDate: "",
                description: ""
            });
        } catch (error) {
            console.error("Error creating export order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <ExportOrderHeader />

                <WarehouseSelectionCard formData={formData} setFormData={setFormData} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        {formData.warehouse && (
                            <ProductExportTable warehouseId={formData.warehouse} />
                        )}
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                        <ExportCart />
                        <ExportOrderSummary
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