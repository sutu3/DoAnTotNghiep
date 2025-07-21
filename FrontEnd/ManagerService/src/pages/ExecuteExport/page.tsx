import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import {MiddleExportOrder, MiddleGetAllExportOrderByStatus} from "@/Store/Thunk/ExportOrderThunk.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import { ExportOrder } from "@/Store/ExportOrderSlice.tsx";
import {ExportOrderItemSelector, ExportOrderSelector} from "@/Store/Selector.tsx";
import PageHeader from "@/components/Admin/OrderExport/PageHeader.tsx";
import ExportStatsCards from "@/components/Admin/OrderExport/Card/ExportStatsCards.tsx";
import ExportOrdersTable from "@/components/Admin/OrderExport/Table/ExportOrdersTableToExport.tsx";
import ExportExecutionModal from "@/components/Admin/OrderExport/Modal/ExportExecutionModal.tsx";


export default function ExecuteExportPage() {
    const exportOrders = useSelector(ExportOrderSelector);
    const [selectedOrder, setSelectedOrder] = useState<ExportOrder | null>(null);
    const [executionProgress, setExecutionProgress] = useState(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const item=useSelector(ExportOrderItemSelector)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const page: pageApi = { pageNumber: 0, pageSize: 5 };
                await (dispatch as any)(MiddleGetAllExportOrderByStatus("Approved", page));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleExecuteExport = (order: ExportOrder) => {
        setSelectedOrder(order);
        setExecutionProgress(0);
        setIsExecuting(false);
        onOpen();
    };

    const handleStartExecution = async () => {
        if (!selectedOrder) return;

        setIsExecuting(true);
        setExecutionProgress(0);

        try {
            // Convert ExportOrderItem to ExportItemCreate

            // Call middleware instead of simulation
            await (dispatch as any)(MiddleExportOrder(
                selectedOrder.exportOrderId,
                item
            ));

            setExecutionProgress(100);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Export execution failed:", error);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleRefresh = async () => {
        const page: pageApi = { pageNumber: 0, pageSize: 5 };
        await (dispatch as any)(MiddleGetAllExportOrderByStatus("Approved", page));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                <PageHeader />

                <ExportStatsCards exportOrders={exportOrders} />

                <ExportOrdersTable
                    loading={loading}
                    exportOrders={exportOrders}
                    onExecuteExport={handleExecuteExport}
                    onRefresh={handleRefresh}
                />

                <ExportExecutionModal
                    isOpen={isOpen}
                    onClose={onClose}
                    selectedOrder={selectedOrder}
                    isExecuting={isExecuting}
                    executionProgress={executionProgress}
                    onStartExecution={handleStartExecution}
                />
            </div>
        </div>
    );
}