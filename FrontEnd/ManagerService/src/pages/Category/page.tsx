"use client";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {  useSelector } from "react-redux";
import { CategorySelector } from "@/Store/Selector.tsx";
import { useEffect, useState } from "react";
import { Textarea } from "@heroui/input";
import FormInput from "@/components/Admin/UnitType/Input/InputText.tsx";
import { Category } from "@/Store/CategorySlice.tsx";
import TableUI from "@/components/Admin/Category/Table/TableUI.tsx";
import {Layers} from "lucide-react";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import ModalUnit from "@/components/Admin/Category/Modal/ModalUI.tsx";

const CategoryPage = () => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    const object = useSelector(CategorySelector);

    // ✅ Tránh undefined khi chưa có object[0]
    const [categoryEdit, setCategoryEdit] = useState<Category>({
        categoryId: "",
        categoryName: "",
        createByUser: undefined,
        createdAt: undefined,
        description: "",
        warehouses: undefined
    });

    const [open, setOpen] = useState(false);

    const handleChangeKey = (key: string) => {
        const category = object.find((el: { categoryId: string; }) => el.categoryId === key);
        if (category) {
            setCategoryEdit(category);
        }
    };

    const handleInputChange = (key: keyof Category, value: string | number) => {
        setCategoryEdit((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (object && object.length > 0) {
            setCategoryEdit(object[0]);
        }
    }, [object]);

    return (
        <div className="min-h-screen dark:bg-gray-900 bg-background p-4 md:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <BreadcrumbsUI isDarkMode={isDarkMode} />
                    <div className="text-left md:text-right">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-gray-100">Category Page</h1>
                        <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">Manage and category.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-card dark:bg-gray-800 shadow-md rounded-lg border border-border">
                            <div className="px-6 py-4 border-b border-border dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-foreground dark:text-gray-200">Category List</h2>
                            </div>
                            <div className="p-6">
                                <div className="text-center text-muted-foreground italic">
                                    <TableUI
                                        open={open}
                                        setOpen={setOpen}
                                        key={categoryEdit?.categoryId}
                                        setKey={handleChangeKey}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-card shadow-md rounded-lg border border-border dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">Category Details</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <FormInput
                                            label="Group Name"
                                            value={categoryEdit?.categoryName ?? ""}
                                            onChange={(val) => handleInputChange("categoryName", val)}
                                            type="text"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Description
                                        </label>
                                        <Textarea
                                            aria-labelledby="Input"
                                            className="max-w-xs"
                                            variant="faded"
                                            value={categoryEdit?.description ?? ""}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Enter your description"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex justify-end">
                                <ButtonUI

                                    className=" text-blue-600 shadow-lg"
                                    label="Edit Category"
                                    loading={false}
                                    startContent={<Layers/>}
                                    onClick={() => {
                                    }}
                                    variant={"bordered"}
                                color={"secondary"}/>
                            </div>
                        </div>
                    </div>
                    <ModalUnit open={open} setOpen={setOpen}/>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
