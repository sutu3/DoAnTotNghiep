
import { useState } from "react";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI";
import { useDisclosure } from "@heroui/react";
import ImportOrderTable from "@/components/Admin/OrderImport/Table/ImportOrderTable.tsx";
import {Icon} from "@iconify/react";
import ImportOrderDetailModal from "@/components/Admin/OrderImport/Modal/ImportOrderDetailModal";
import RejectReasonModal from "@/components/Admin/OrderImport/Modal/RejectReasonModal.tsx";
import {ImportOrder, ImportOrderItem} from "@/Store/ImportOrder.tsx";

export interface BinLocation {
    binId: string;
    binCode: string;
    stackName: string;
    status: "EMPTY" | "FULL" | "MAINTENANCE";
    capacity: number;
    currentQuantity?: number;
}

export interface StackLocation {
    stackId: string;
    stackName: string;
    bins: BinLocation[];
    totalBins: number;
    availableBins: number;
}
export default function AdminImportOrderManagement() {

    const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [rejectReason, setRejectReason] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();

    const isSidebarCollapsed = localStorage.getItem("theme") !== "light";


    const handleApprove = async (orderId: string) => {
        try {
            // const response = await fetchApi({
            //     method: "PUT",
            //     url: `${API_ROUTES.order.importOrder(null).addOrderImport}/${orderId}/approve`
            // });

            // if (response.success) {
            //     fetchOrders(currentPage, statusFilter);
            //     onDetailClose();
            // }
        } catch (error) {
            console.error("Error approving order:", error);
        }
    };

    const handleReject = async (orderId: string) => {
        try {
            // const response = await fetchApi({
            //     method: "PUT",
            //     url: `${API_ROUTES.order.importOrder(null).addOrderImport}/${orderId}/reject`,
            //     data: { reason: rejectReason }
            // });
            //
            // if (response.success) {
            //     fetchOrders(currentPage, statusFilter);
            //     onRejectClose();
            //     setRejectReason("");
            // }
        } catch (error) {
            console.error("Error rejecting order:", error);
        }
    };

    // Thay đổi function fetch


    //Cập nhật handleItemClick
    const handleItemClick = async (item: ImportOrderItem) => {

    };



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 sm:p-2 lg:p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />

                    <div className="sm:text-right">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="mdi:clipboard-list" className="text-2xl sm:text-3xl text-blue-600"/>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Quản Lý Yêu Cầu Nhập Hàng
                            </h1>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Duyệt và xử lý các yêu cầu nhập hàng từ nhân viên
                        </p>
                    </div>
                </div>

                <ImportOrderTable
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onViewOrder={(order) => {
                        setSelectedOrder(order);
                        onDetailOpen();
                    }}
                    onApproveOrder={handleApprove}
                    onRejectOrder={(order) => {
                        setSelectedOrder(order);
                        onRejectOpen();
                    }}
                />

                <ImportOrderDetailModal
                    isOpen={isDetailOpen}
                    onClose={onDetailClose}
                    selectedOrder={selectedOrder}
                    onApprove={handleApprove}
                    onReject={(order) => {
                        setSelectedOrder(order);
                        onRejectOpen();
                        onDetailClose();
                    }}
                    onItemClick={handleItemClick}
                />

                <RejectReasonModal
                    isOpen={isRejectOpen}
                    onClose={onRejectClose}
                    rejectReason={rejectReason}
                    setRejectReason={setRejectReason}
                    onConfirm={() => {
                        if (selectedOrder) {
                            handleReject(selectedOrder.importOrderId);
                        }
                    }}
                />
                {/*<ProductInventoryStatsModal*/}
                {/*    isOpen={isLocationOpen}*/}
                {/*    onClose={onLocationClose}*/}
                {/*    selectedItem={selectedItem}*/}
                {/*    inventoryStats={inventoryStats}*/}
                {/*/>*/}
                {/*<ProductLocationModal*/}
                {/*    isOpen={isLocationOpen}*/}
                {/*    onClose={onLocationClose}*/}
                {/*    selectedItem={selectedItem}*/}
                {/*    stackLocations={stackLocations}*/}
                {/*/>*/}
            </div>
        </div>
    );
}