"use client";

import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {setAllWarehouse, Warehouse} from "@/Store/WarehouseSlice.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import { WarehouseTableSection } from "@/components/Warehouse/WarehouseTableSection";
import WarehouseThumbnail from "@/components/Warehouse/WarehouseThumbnail";
import WarehouseModal from "@/components/Warehouse/Modal/WarehouseModal.tsx";
import {GetAllWarehouse} from "@/Store/Thunk/WarehouseThunk.tsx";
import {TotalPageWarehouse, warehouseListSelector} from "@/Store/Selector.tsx";
import {initToTalPage} from "@/Store/ProductSlice.tsx";

const WarehousePage = () => {
    const dispatch = useDispatch();
    const warehouses:Warehouse[] = useSelector(warehouseListSelector);
    const totalPage = useSelector(TotalPageWarehouse);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        warehouseName: "",
        address: "",
        capacity: 0,
        manager: "",
    });

    const isDarkMode = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        setLoading(true)
        const fetch = async () => {
            setLoading(true);
            const PageApi: pageApi = { pageNumber: page - 1, pageSize: 10 };
            const result = await (dispatch as any)(GetAllWarehouse({ page: PageApi }));


            if (result?.payload?.result?.content) {
                dispatch(setAllWarehouse(result.payload.result.content));
                dispatch(initToTalPage(result.payload.result.totalPages));
            } else {
                console.warn("Không có data trong payload");
            }

            setLoading(false);
        };
        fetch()
    }, [page, dispatch]);

    useEffect(() => {
        if (warehouses && warehouses.length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(warehouses[0]);
        }
    }, [warehouses, selectedWarehouse]);

    const handleWarehouseSelect = (warehouseId: string) => {
        const warehouse = warehouses.find((w: Warehouse) => w.warehouseId === warehouseId);
        if (warehouse) {
            setSelectedWarehouse(warehouse);
        }
    };

    const handleOpenModal = (open: boolean) => {
        setIsModalOpen(open);
    };

    const handleFormChange = (key: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isDarkMode} />
                    </div>
                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Quản lý kho hàng
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Chọn kho để xem thông tin chi tiết và quản lý
                        </p>
                    </div>
                </div>

                {/* Layout 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bên trái: Warehouse Table (2/3) */}
                    <div className="lg:col-span-3">
                        <WarehouseTableSection
                            loading={loading}
                            selectedWarehouse={selectedWarehouse}
                            onWarehouseClick={handleWarehouseSelect}
                            onOpenModal={handleOpenModal}
                            isModalOpen={isModalOpen}
                            warehouses={warehouses}
                            currentPage={page}
                            onPageChange={setPage} totalPage={totalPage}                        />
                    </div>

                    {/* Bên phải: Warehouse Thumbnail (1/3) */}
                    {/*<div className="lg:col-span-1">*/}
                    {/*    <WarehouseThumbnail warehouse={selectedWarehouse} />*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* Modal */}
            <WarehouseModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                formData={formData}
                onFormChange={handleFormChange}
            />
        </div>
    );
};

export default WarehousePage;

