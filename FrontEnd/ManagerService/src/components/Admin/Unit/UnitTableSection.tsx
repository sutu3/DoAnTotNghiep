import React from "react";
import { Ruler, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import UnitTable from "@/components/Admin/UnitType/Table/TableUI.tsx";

interface UnitTableSectionProps {
    loading: boolean;
    selectedUnit: any | null;
    onUnitClick: (unitId: string) => void;
    onOpenModal: (open: boolean) => void;
    isModalOpen: boolean;
    units: any[];
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const UnitTableSection: React.FC<UnitTableSectionProps> = ({
                                                                        loading,
                                                                      selectedUnit,
                                                                      onUnitClick,
                                                                      onOpenModal,
                                                                      units,
                                                                      totalPage,
                                                                      currentPage,
                                                                      onPageChange
                                                                  }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Ruler className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Unit Management
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click on a unit to view details
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onOpenModal(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add New Unit
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <UnitTable
                    loading={loading}
                    units={units}
                    onUnitSelect={onUnitClick}
                    selectedUnitId={selectedUnit?.unitID}
                    totalPage={totalPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default UnitTableSection;