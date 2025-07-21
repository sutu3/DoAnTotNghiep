import React from "react";
import { Tags, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import CategoryTable from "@/components/Admin/Category/Table/TableUI.tsx";

interface CategoryTableSectionProps {
    loading: boolean;
    selectedCategory: any | null;
    onCategoryClick: (categoryId: string) => void;
    onOpenModal: (open: boolean) => void;
    isModalOpen: boolean;
    categories: any[];
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const CategoryTableSection: React.FC<CategoryTableSectionProps> = ({
    loading,
                                                                              selectedCategory,
                                                                              onCategoryClick,
                                                                              onOpenModal,
                                                                              categories,
                                                                              totalPage,
                                                                              currentPage,
                                                                              onPageChange
                                                                          }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Tags className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Product Categories
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click on a category to view details
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onOpenModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add New Category
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <CategoryTable
                    loading={loading}
                    categories={categories}
                    onCategorySelect={onCategoryClick}
                    selectedCategoryId={selectedCategory?.categoryId}
                    totalPage={totalPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default CategoryTableSection;