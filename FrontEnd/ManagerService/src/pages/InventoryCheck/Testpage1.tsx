import  { useState } from 'react';
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { List, Plus, Edit, Eye } from "lucide-react";
import CheckSheetListTab from './Components/Tab/InventoryListTab';
import CreateCheckSheetTab from './Components/Tab/CreateCheckSheetTab';
import UpdateCheckSheetTab from "@/pages/InventoryCheck/Components/Tab/UpdateCheckSheetTab.tsx";
import CheckSheetDetailTab from "@/pages/InventoryCheck/Components/Tab/CheckSheetDetailTab.tsx";
import {InventoryCheckSheet} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";

const InventoryCheckSheetPage = () => {
    const [activeTab, setActiveTab] = useState("list");
    const [selectedCheckSheet, setSelectedCheckSheet] = useState<InventoryCheckSheet|null>(null);

    const handleViewDetail = (checkSheet: InventoryCheckSheet) => {
        setSelectedCheckSheet(checkSheet);
        setActiveTab("detail");
    };

    const handleEditCheckSheet = (checkSheet: InventoryCheckSheet) => {
        setSelectedCheckSheet(checkSheet);
        setActiveTab("update");
    };

    const handleCreateNew = () => {
        setSelectedCheckSheet(null);
        setActiveTab("create");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-3">
                            <Icon icon="mdi:clipboard-check" className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Quản Lý Phiếu Kiểm Kê Kho
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Tạo, quản lý và theo dõi các phiếu kiểm kê tồn kho
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
                                cursor: "w-full bg-purple-600",
                                tab: "max-w-fit px-4 h-12",
                                tabContent: "group-data-[selected=true]:text-purple-600"
                            }}
                        >
                            <Tab
                                key="list"
                                title={
                                    <div className="flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        <span>Danh Sách Phiếu Kiểm Kê</span>
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
                                key="update"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        <span>Cập Nhật Phiếu</span>
                                    </div>
                                }
                                isDisabled={!selectedCheckSheet || selectedCheckSheet?.status === 'DRAFF'}
                            />
                            <Tab
                                key="detail"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Chi Tiết Phiếu</span>
                                    </div>
                                }
                                isDisabled={!selectedCheckSheet}
                            />
                        </Tabs>
                    </CardBody>
                </Card>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "list" && (
                        <CheckSheetListTab
                            onCreateNew={handleCreateNew}
                            onViewDetail={handleViewDetail}
                            onEditCheckSheet={handleEditCheckSheet}
                        />
                    )}

                    {activeTab === "create" && (
                        <CreateCheckSheetTab
                            onBack={() => setActiveTab("list")}
                            onSuccess={() => setActiveTab("list")}
                        />
                    )}

                    {activeTab === "update" && selectedCheckSheet && (
                        <UpdateCheckSheetTab
                            checkSheet={selectedCheckSheet}
                            setCheckSheet={setSelectedCheckSheet}
                            onBack={() => setActiveTab("list")}
                            onSuccess={() => setActiveTab("detail")}

                        />
                    )}

                    {activeTab === "detail" && selectedCheckSheet && (
                        <CheckSheetDetailTab
                            checkSheet={selectedCheckSheet}
                            onBack={() => setActiveTab("list")}
                            onEdit={() => setActiveTab("update")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryCheckSheetPage;