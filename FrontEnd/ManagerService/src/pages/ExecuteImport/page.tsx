"use client";

import { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Package, FileText, Plus, List } from "lucide-react";
import ReceiptListComponent from "@/pages/ExecuteImport/Component/ReceiptListComponent.tsx";
import CreateReceiptComponent from "./Component/CreateReceiptComponent";
import {ImportOrder} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import UpdateReceiptComponent from "./Component/UpdateReceiptComponent";
import ReceiptDetailComponent from "@/pages/ExecuteImport/Component/ReceiptDetailComponent.tsx";
import {WarehouseReceiptResponse} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";

export default function WarehouseReceiptManagementPage() {
    const [activeTab, setActiveTab] = useState("list");
    const [selectedReceipt, setSelectedReceipt] = useState<WarehouseReceiptResponse|null>(null);
    const [selectedOrder, setSelectedOrder] = useState<ImportOrder|undefined>(undefined);
    const handleViewDetail = (receipt: any) => {
        setSelectedReceipt(receipt);
        setActiveTab("detail");
    };

    const handleEditReceipt = (receipt: any) => {
        setSelectedReceipt(receipt);
        setActiveTab("update");
    };

    const handleCreateFromOrder = (order: any) => {
        setSelectedOrder(order);
        setActiveTab("create");
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
                                Quản Lý Phiếu Nhập Kho
                            </h1>
                            <p className="text-gray-600">
                                Tạo và quản lý phiếu nhập kho từ đơn hàng đã được duyệt
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Card className="mb-6">
                    <CardBody className="p-0">
                        <Tabs
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-4 border-b border-divider",
                                cursor: "w-full bg-blue-600",
                                tab: "max-w-fit px-4 h-12",
                                tabContent: "group-data-[selected=true]:text-blue-600"
                            }}
                        >
                            <Tab
                                key="list"
                                title={
                                    <div className="flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        <span>Danh Sách Phiếu</span>
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
                                        <FileText className="w-4 h-4" />
                                        <span>Chi Tiết</span>
                                    </div>
                                }
                                isDisabled={!selectedReceipt}
                            />
                            <Tab
                                key="update"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        <span>Cập Nhật</span>
                                    </div>
                                }
                                isDisabled={!selectedReceipt}
                            />
                        </Tabs>
                    </CardBody>
                </Card>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "list" && (
                        <ReceiptListComponent
                            onViewDetail={handleViewDetail}
                            onEditReceipt={handleEditReceipt}
                            onCreateFromOrder={handleCreateFromOrder}
                        />
                    )}

                    {activeTab === "create" && (
                        <CreateReceiptComponent
                            setSelectedOrder={setSelectedOrder}
                            selectedOrder={selectedOrder}
                            onSuccess={() => setActiveTab("list")}
                        />
                    )}

                    {activeTab === "detail" && selectedReceipt && (
                        <ReceiptDetailComponent
                            receipt={selectedReceipt}
                            onEdit={() => setActiveTab("update")}
                            onBack={() =>setActiveTab("list")}
                        />
                    )}

                    {activeTab === "update" && selectedReceipt && (
                        <UpdateReceiptComponent
                            receipt={selectedReceipt}
                            onSuccess={() => {
                                setActiveTab("list");
                                setSelectedReceipt(null)
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}