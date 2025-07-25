import React, {  useState } from 'react';
import {  useDispatch } from 'react-redux';
import InventoryCheckHeader from "@/components/Staff/InventoryCheck/InventoryCheckHeader.tsx";
import InventoryStatsOverview from "@/components/Staff/InventoryCheck/InventoryStatsOverview.tsx";
import ProductSearchPanel from '@/components/Staff/InventoryCheck/ProductSearchPanel';
import WarehouseCapacityWidget from "@/components/Staff/InventoryCheck/WarehouseCapacityWidget.tsx";
import InventoryTable from "@/components/Staff/InventoryCheck/Table/InventoryTable.tsx";

const EmployeeInventoryCheckPage = () => {
    const dispatch = useDispatch();
    const [searchFilter, setSearchFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <InventoryCheckHeader />

                {/* Stats Overview Cards */}
                <InventoryStatsOverview />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel - Search & Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProductSearchPanel
                            searchFilter={searchFilter}
                            categoryFilter={categoryFilter}
                            statusFilter={statusFilter}
                            onSearchChange={setSearchFilter}
                            onCategoryChange={setCategoryFilter}
                            onStatusChange={setStatusFilter}
                        />
                        <WarehouseCapacityWidget />
                    </div>

                    {/* Right Panel - Inventory Table */}
                    <div className="lg:col-span-3">
                        <InventoryTable
                            searchFilter={searchFilter}
                            categoryFilter={categoryFilter}
                            statusFilter={statusFilter}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EmployeeInventoryCheckPage;