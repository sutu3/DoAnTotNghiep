
import { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import {Plus, List, Eye} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import { useWarehouseDeliveryStore } from "@/zustand/warehouseDeliveryStore";
import DeliveryHeader from "@/pages/ExecuteExport/Component/DeliveryHeader.tsx";
import ExportOrderSelection from "./Component/Select/ExportOrderSelection.tsx";
import DeliveryItemsTable from "@/pages/ExecuteExport/Component/Table/DeliveryItemsTable.tsx";
import DeliveryCart from "@/pages/ExecuteExport/Component/DeliveryCart.tsx";
import DeliverySummary from "@/pages/ExecuteExport/Component/DeliverySummary.tsx";
import DeliveryListComponent from "./Component/Tab/DeliveryListComponent.tsx";
import {ExportOrder} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {MiddleExportOrder} from "@/pages/ExecuteExport/Store/Thunk/ExportOrderThunk.tsx";
import {
    WarehouseDeliveryRequest,
    WarehouseDeliveryResponse
} from "@/pages/ExecuteExport/Store/WarehouseDeliverySlice.tsx";
import {ExportOrderSelector} from "@/pages/ExecuteExport/Store/Selector.tsx";
import DeliveryDetailView from "@/pages/ExecuteExport/Component/Tab/DeliveryDetailView.tsx";

export default function WarehouseDeliveryPage() {
    const { items, clearItems } = useWarehouseDeliveryStore();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("list");
    const [formData, setFormData] = useState({
        exportOrderId: "",
        warehouse: "",
        notes: ""
    });
    const [selectedDelivery, setSelectedDelivery] =useState<WarehouseDeliveryResponse|null>(null);
    const exportOrders:ExportOrder[] = useSelector(ExportOrderSelector);
    const exportOrder: ExportOrder | undefined = formData.exportOrderId!=""?exportOrders.find((order: ExportOrder) => order.exportOrderId === formData.exportOrderId):undefined;

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log("Submitting delivery with data:", formData);
            console.log("Items to deliver:", items);
            const newFormData: WarehouseDeliveryRequest = {
                exportOrderId: formData.exportOrderId,
                notes: formData.notes,
                deliveryItems: items.map(item => ({
                    exportItemId: item.exportItemId,
                    deliveredQuantity: item.realityQuantity,
                    binLocation: item.bin?.binId ?? "",
                    note: item.note
                }))
            };
            console.log("Items for Request:", newFormData);
            await (dispatch as any)(MiddleExportOrder(
                newFormData,
                items
            ));
            clearItems();
            setFormData({
                exportOrderId: "",
                warehouse: "",
                notes: ""
            });
            // Chuyển về tab danh sách sau khi tạo thành công
            setActiveTab("list");
        } catch (error) {
            console.error("Error creating delivery:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleViewDelivery = (delivery: any) => {
        setSelectedDelivery(delivery);
        setActiveTab("detail");
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <DeliveryHeader />
                {/* Tabs Navigation */}
                <Card className="mb-6">
                    <CardBody className="p-0">
                        <Tabs
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-4 border-b border-divider",
                                cursor: "w-full bg-orange-600",
                                tab: "max-w-fit px-4 h-12",
                                tabContent: "group-data-[selected=true]:text-orange-600"
                            }}
                        >
                            <Tab
                                key="list"
                                title={
                                    <div className="flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        <span>Danh Sách Phiếu Xuất</span>
                                    </div>
                                }
                            />
                            <Tab
                                key="create"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        <span>Tạo Phiếu Mới</span>
                                    </div>
                                }
                            />
                            <Tab
                                key="detail"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Xem Chi Tiết</span>
                                    </div>
                                }
                                isDisabled={!selectedDelivery}
                            />

                        </Tabs>
                    </CardBody>
                </Card>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "list" && (
                        <DeliveryListComponent
                            onCreateNew={() => setActiveTab("create")}
                            onViewDelivery={handleViewDelivery}
                        />
                    )}

                    {activeTab === "create" && (
                        <div className="space-y-6">
                            <ExportOrderSelection formData={formData} setFormData={setFormData} />

                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                                <div className="xl:col-span-3">
                                    {formData.exportOrderId && (
                                        <DeliveryItemsTable
                                            exportOrder={exportOrder}
                                            exportOrderId={formData.exportOrderId}
                                        />
                                    )}
                                </div>
                                <div className="xl:col-span-2 space-y-6">
                                    <DeliveryCart />
                                    <DeliverySummary
                                        exportOrder={exportOrder}
                                        onSubmit={handleSubmit}
                                        loading={loading}
                                        disabled={items.length === 0 || !formData.exportOrderId}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "detail" && selectedDelivery && (
                        <DeliveryDetailView
                            delivery={selectedDelivery}
                            onBack={() => setActiveTab("list")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}