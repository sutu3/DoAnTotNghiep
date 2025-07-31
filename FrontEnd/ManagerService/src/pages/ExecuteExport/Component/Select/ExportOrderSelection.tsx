import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {pageApi} from "@/Api/UrlApi.tsx";
import {MiddleGetAllExportOrderByStatus} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";
import {ExportOrder} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {useWarehouseDeliveryStore} from "@/zustand/warehouseDeliveryStore.tsx";
import {ExportOrderSelector} from "@/pages/ExecuteExport/Store/Selector.tsx";
// import { MiddleGetApprovedExportOrders } from "@/Store/Thunk/ExportOrderThunk";

interface ExportOrderSelectionProps {
    formData: any;
    setFormData: (formData: (prev: any) => any) => void;
}

export default function ExportOrderSelection({ formData, setFormData }: ExportOrderSelectionProps) {
    const {  clearItems } = useWarehouseDeliveryStore();
    const dispatch = useDispatch();
    const exportOrders:ExportOrder[] = useSelector(ExportOrderSelector);
    const [loading, setLoading] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    useEffect(() => {
        const fetchApprovedOrders = async () => {
            setLoading(true);
            try {
                if(selectedWarehouse!=""){
                    const page:pageApi={ pageNumber: 0, pageSize: 5 };
                    await (dispatch as any)(MiddleGetAllExportOrderByStatus(selectedWarehouse,"Approved", page));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchApprovedOrders();
    }, [dispatch,selectedWarehouse]);

    return (
        <Card className="mb-6 shadow-sm border-l-4 border-l-orange-500">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:clipboard-list" className="text-xl text-orange-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Chọn Đơn Xuất Hàng</h2>
                </div>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        aria-labelledby="Input"
                        label="Đơn xuất hàng đã duyệt"
                        placeholder="Chọn đơn xuất hàng"
                        selectedKeys={formData.exportOrderId ? [formData.exportOrderId] : []}
                        onSelectionChange={(keys) => {
                            const orderId = Array.from(keys)[0]?.toString();
                            const order = exportOrders.find((o: any) => o.exportOrderId === orderId);
                            clearItems();
                            setFormData(prev => ({
                                ...prev,
                                exportOrderId: orderId,
                                warehouse: order?.warehouse?.warehouseId
                            }));
                        }}
                        isLoading={loading}
                        startContent={<Icon icon="mdi:package-variant" />}
                    >
                        {exportOrders.filter((order: ExportOrder) => order.status === "APPROVED").map((order: any) => (
                            <SelectItem                         aria-labelledby="Input"
                                                                key={order.exportOrderId}>
                                <div className="flex flex-col">
                                    <span className="font-medium">#{order.exportOrderId.slice(-8)}</span>
                                    <span className="text-sm text-gray-500">
                                        {order.customer?.supplierName} - {order.totalAmount?.toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                    <SelectWarehouseApproved warehouse={selectedWarehouse} setWarehouse={setSelectedWarehouse}/>

                    {formData.exportOrderId && (
                        <Card className="bg-green-50 border-green-200">
                            <CardBody className="p-3">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:check-circle" className="text-green-600" />
                                    <span className="text-sm font-medium text-green-800">
                                        Đơn hàng đã chọn
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}