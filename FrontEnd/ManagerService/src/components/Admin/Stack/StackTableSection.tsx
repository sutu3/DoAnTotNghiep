import {Layers, Plus} from "lucide-react";
import {Button} from "@heroui/button";
import  {StackTable} from "@/components/UI/Table/TableUI.tsx";
import {StackCreate, StackType} from "@/Store/StackSlice.tsx";
import SelectWarehouse from "@/components/Admin/Stack/Select/SelectWarehouse.tsx";

interface StackTableSectionProps {
    data:StackCreate;
    onChange:(key:string,value:string|number) => void
    selectedStack: StackType | null;
    onStackClick: (stackId: string) => void;
    onOpenModal: (b: boolean) => void;
    isModalOpen: boolean;
}

export const StackTableSection = ({
                                      data, onChange,
                                      selectedStack,
                                      onStackClick,
                                      onOpenModal,
                                  }: StackTableSectionProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header Section - Redesigned */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                {/* Top Row - Title and Action */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Storage Locations
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage warehouse storage stacks and locations
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onOpenModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add New Stack
                    </Button>
                </div>

                {/* Bottom Row - Filters and Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-[300px]">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Warehouse:
                            </span>
                            <SelectWarehouse formData={data} setFormData={onChange} />
                        </div>

                        {/* Additional filter space */}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedStack ? `Selected: ${selectedStack.stackName}` : 'No stack selected'}
                        </div>
                    </div>

                    {/* Stats or additional info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Click on a stack to view details
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-6">
                <StackTable
                    data={data}
                    onStackSelect={onStackClick}
                    onAddNew={() => onOpenModal(true)}
                    selectedStackId={selectedStack?.stackId}
                />
            </div>
        </div>
    );
};