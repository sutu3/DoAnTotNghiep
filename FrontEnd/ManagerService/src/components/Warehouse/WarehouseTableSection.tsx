import React from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import WarehouseTable from "@/components/Warehouse/Table/WarehouseTable.tsx";

interface WarehouseTableSectionProps {
    selectedWarehouse: any | null;
    onWarehouseClick: (warehouseId: string) => void;
    onOpenModal: (open: boolean) => void;
    isModalOpen: boolean;
    warehouses: any[];
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const WarehouseTableSection: React.FC<WarehouseTableSectionProps> = ({
                                                                                selectedWarehouse,
                                                                                onWarehouseClick,
                                                                                onOpenModal,
                                                                                warehouses,
                                                                                totalPage,
                                                                                currentPage,
                                                                                onPageChange
                                                                            }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Warehouse Management
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click on a warehouse to view details
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onOpenModal(true)}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add New Warehouse
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <WarehouseTable
                    warehouses={warehouses}
                    onWarehouseSelect={onWarehouseClick}
                    selectedWarehouseId={selectedWarehouse?.warehouseId}
                    totalPage={totalPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default WarehouseTableSection;