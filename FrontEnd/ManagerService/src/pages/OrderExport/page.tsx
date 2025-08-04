"use client";

import {useState} from "react";
import {useDispatch} from "react-redux";
import {MiddleAddOrderExport} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import {useExportOrderStore} from "@/zustand/ExportOrderStore";
import ExportOrderHeader from "./Component/ExportOrderHeader";
import WarehouseSelectionCard from "./Component/WarehouseSelectionCard";
import ProductExportTable from "./Component/Table/ProductExportTable";
import ExportCart from "@/pages/OrderExport/Component/Cart/ExportCart.tsx";
import ExportOrderSummary from "./Component/ExportOrderSummary";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import ProductFilterPanel from "@/pages/OrderExport/Component/select/SelectProductFilter.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export interface Filters{
    searchTerm: string;
    categoryFilter: string;
    unitFilter: string;
    supplierFilter: string;
}
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

    // Filter states
    const [filters, setFilters] = useState<Filters>({
        searchTerm: "",
        categoryFilter: "all",
        unitFilter: "all",
        supplierFilter: "all"
    });


    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const handleOnChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };


    const handleClearFilters = () => {
        setFilters({
            searchTerm: "",
            categoryFilter: "all",
            unitFilter: "all",
            supplierFilter: "all"
        });
    };

    const handleSubmit = async () => {

        if(formData.deliveryDate!=""){
            if(formData?.customer!=""){
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
            }else{
                showToast({
                    title: "Chọn khách hàng trước khi tiếp tục",
                    description: "Vui lòng chọn một khách hàng để thêm sản phẩm vào đơn hàng.",
                    color: "warning", // hoặc "danger" nếu muốn nổi bật mạnh
                });
            }
        }else{
            showToast({
                title: "Chọn ngay giao hàng",
                description: "Vui lòng chọn ngày giao hàng trước khi tạo đơn xuất",
                color: "warning",
            });
        }

    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <ExportOrderHeader />

                {/* Warehouse Selection */}
                <WarehouseSelectionCard formData={formData} handleOnChange={handleOnChange} />
                <div className="xl:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <ProductFilterPanel
                            searchTerm={filters.searchTerm}
                            categoryFilter={filters.categoryFilter}
                            unitFilter={filters.unitFilter}
                            supplierFilter={filters.supplierFilter}
                            onSearchChange={(value) => handleFilterChange('searchTerm', value)}
                            onCategoryChange={(value) => handleFilterChange('categoryFilter', value)}
                            onUnitChange={(value) => handleFilterChange('unitFilter', value)}
                            onSupplierChange={(value) => handleFilterChange('supplierFilter', value)}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>
                {/* Main Content Grid - Improved Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
                    <div className="xl:col-span-5">
                        {formData.warehouse && (
                            <ProductExportTable
                                formData={formData}
                                filters={filters}
                            />
                        )}
                    </div>

                    {/* Right Sidebar - Cart & Summary */}
                    <div className="xl:col-span-2">
                        <div className="sticky top-6 space-y-6">
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
        </div>
    );
}