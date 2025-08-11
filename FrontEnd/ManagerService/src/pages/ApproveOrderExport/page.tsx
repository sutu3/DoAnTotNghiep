"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import ExportOrderTable from "@/components/Admin/OrderExport/Table/ExportOrderTable.tsx";
import ExportOrderDetailModal from "@/components/Admin/OrderExport/Modal/ExportOrderDetailModal.tsx";
import ExportOrderRejectModal from "@/components/Admin/OrderExport/Modal/ExportOrderRejectModal.tsx";
import OrderExportSlice, { ExportOrder } from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {
    ApproveExportOrder,
    RejectExportOrder
} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import {useDispatch} from "react-redux";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export default function AdminExportOrderManagement() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<ExportOrder | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const isSidebarCollapsed = localStorage.getItem("theme") !== "light";

    const handleViewOrder = (order: ExportOrder) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };
    const dispatch = useDispatch();
    const handleApproveOrder = async (orderId: string) => {
        // Logic approve order
        await (dispatch as any)(ApproveExportOrder({orderId}));
        dispatch(OrderExportSlice.actions.setRemoveOrderList(orderId));
        setIsDetailModalOpen(false);
        showToast({
            title: "Phê duyệt đơn hàng thành công",
            description: `Đơn hàng đã được phê duyệt và cập nhật thành công.`,
            color: "Success",
        });
    };

    const handleRejectOrder = async (order: ExportOrder) => {
        await (dispatch as any)(RejectExportOrder({orderId:order.exportOrderId}));
        dispatch(OrderExportSlice.actions.setOrderExportList([]));
        showToast({
            title: "Từ chối đơn hàng thành công",
            description: `Đơn hàng đã bị từ chối và cập nhật thành công.`,
            color: "Success",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />

                    <div className="sm:text-right">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="mdi:clipboard-list" className="text-2xl sm:text-3xl text-blue-600"/>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Quản Lý Yêu Cầu Xuất Hàng
                            </h1>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Duyệt và xử lý các yêu cầu Xuất hàng từ nhân viên
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="shadow-xl">
                    <CardBody className="p-0">
                        <ExportOrderTable
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            onViewOrder={handleViewOrder}
                            onApproveOrder={handleApproveOrder}
                            onRejectOrder={handleRejectOrder}
                        />
                    </CardBody>
                </Card>

                {/* Modals */}
                <ExportOrderDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    order={selectedOrder}
                    onApprove={handleApproveOrder}
                    onReject={handleRejectOrder}
                />

                <ExportOrderRejectModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    order={selectedOrder}
                />
            </div>
        </div>
    );
}