import  { useState } from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import CreateCheckSheetTab from './Components/Tab/CreateCheckSheetTab';
import InventoryListTab from './Components/Tab/InventoryListTab';
import CheckSheetListTab from './Components/Tab/InventoryListTab';
import EditCheckSheetTab from './Components/Tab/EditCheckSheetTab';

const InventoryAuditPage = () => {
    const [selectedTab, setSelectedTab] = useState("inventory-list");

    return (
        <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Icon icon="mdi:clipboard-check-multiple" className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Kiểm Kê Hàng Hóa
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Quản lý và thực hiện kiểm kê tồn kho toàn diện
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Card className="shadow-xl border-0">
                    <CardBody className="p-0">
                        <Tabs
                            selectedKey={selectedTab}
                            onSelectionChange={(key) => setSelectedTab(key as string)}
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-6 border-b border-divider bg-white dark:bg-gray-800",
                                cursor: "w-full bg-gradient-to-r from-blue-500 to-indigo-600",
                                tab: "max-w-fit px-6 py-3 h-12",
                                tabContent: "group-data-[selected=true]:text-blue-600 font-semibold"
                            }}
                        >
                            <Tab
                                key="inventory-list"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:warehouse" />
                                        <span>Danh Sách Hàng Hóa</span>
                                    </div>
                                }
                            >
                                <InventoryListTab />
                            </Tab>

                            <Tab
                                key="create-check-sheet"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:plus-circle" />
                                        <span>Tạo Phiếu Kiểm Kê</span>
                                    </div>
                                }
                            >
                                <CreateCheckSheetTab />
                            </Tab>

                            <Tab
                                key="check-sheet-list"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:file-document-multiple" />
                                        <span>Danh Sách Phiếu Kiểm Kê</span>
                                    </div>
                                }
                            >
                                <CheckSheetListTab />
                            </Tab>

                            <Tab
                                key="edit-check-sheet"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:file-edit" />
                                        <span>Chỉnh Sửa Phiếu</span>
                                    </div>
                                }
                            >
                                <EditCheckSheetTab />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default InventoryAuditPage;