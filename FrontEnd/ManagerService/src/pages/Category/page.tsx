"use client";

import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import { CategorySelector, TotalPageCategory } from "@/Store/Selector.tsx";
import { MiddleGetAllCategory } from "@/Store/Thunk/CategoryThunk.tsx";
import CategorySlice, { Category } from "@/Store/CategorySlice.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import ModalCategory from "@/components/Admin/Category/Modal/ModalUI.tsx";
import CategoryThumbnail from "@/components/Admin/Category/CategoryThumbnail.tsx";
import CategoryTableSection from "@/components/Admin/Category/Table/CategoryTableSection.tsx";

const CategoryPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector(CategorySelector);
    const totalPage = useSelector(TotalPageCategory);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);


    const isDarkMode = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        dispatch(CategorySlice.actions.setCategoryList([]))
        setSelectedCategory(null)
        setLoading(true);
        const fetch=async ()=>{
            const PageApi: pageApi = { pageNumber: page - 1, pageSize: 10 };
            await (dispatch as any)(MiddleGetAllCategory(PageApi));
            setLoading(false);
        }
        fetch();

    }, [page, dispatch]);

    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const handleCategorySelect = (categoryId: string) => {
        const category = categories.find((c: Category) => c.categoryId === categoryId);
        if (category) {
            setSelectedCategory(category);
        }
    };

    const handleOpenModal = (open: boolean) => {
        setIsModalOpen(open);
    };


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isDarkMode} />
                    </div>
                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Quản lý danh mục sản phẩm
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Chọn danh mục để xem thông tin chi tiết
                        </p>
                    </div>
                </div>

                {/* Layout 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bên trái: Category Table (2/3) */}
                    <div className="lg:col-span-2">
                        <CategoryTableSection
                            loading={loading}
                            selectedCategory={selectedCategory}
                            onCategoryClick={handleCategorySelect}
                            onOpenModal={handleOpenModal}
                            isModalOpen={isModalOpen}
                            categories={categories}
                            totalPage={totalPage}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </div>

                    {/* Bên phải: Category Thumbnail (1/3) */}
                    <div className="lg:col-span-1">
                        <CategoryThumbnail category={selectedCategory} />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ModalCategory
                open={isModalOpen}
                setOpen={setIsModalOpen}
            />
        </div>
    );
};

export default CategoryPage;