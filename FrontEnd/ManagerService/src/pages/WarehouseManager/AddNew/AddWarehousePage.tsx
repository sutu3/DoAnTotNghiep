import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import WarehouseBasicForm from '@/components/Warehouse/Form/WarehouseForm';
import WarehouseAddressForm from "@/components/Warehouse/Form/WarehouseAddressForm.tsx";
import {WarehouseCreate} from "@/Store/WarehouseSlice.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddWarehouse} from "@/Store/Thunk/WarehouseThunk.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";



const AddWarehousePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<WarehouseCreate>({
        warehouseName: "",
        address: "",
        street: "",
        district: "",
        country: "",
        description: ""
    });

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await (dispatch as any)(MiddleAddWarehouse(formData));

            // Hiển thị toast thành công
            showToast({
                title: "Thành công",
                description: "Warehouse đã được tạo thành công!",
                color: "success",
            });

            // Đợi 1 giây rồi navigate
            setTimeout(() => {
                navigate("/admin/warehouses");
            }, 1000);

        } catch (error) {
            console.error('Create failed:', error);
            showToast({
                title: "Lỗi",
                description: "Không thể tạo warehouse. Vui lòng thử lại.",
                color: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <BreadcrumbsUI isDarkMode={false} />
                    <div className="flex items-center gap-4 mt-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                            <Icon icon="mdi:warehouse" className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Tạo Warehouse Mới
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Thêm warehouse mới vào hệ thống quản lý
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                            <div className="flex items-center gap-3">
                                <Icon icon="mdi:information" className="text-2xl text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Thông Tin Cơ Bản
                                </h2>
                            </div>
                        </CardHeader>
                        <CardBody className="p-6">
                            <WarehouseBasicForm
                                data={formData}
                                onChange={handleChange}
                            />
                        </CardBody>
                    </Card>

                    {/* Address Information */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                            <div className="flex items-center gap-3">
                                <Icon icon="mdi:map-marker" className="text-2xl text-green-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Địa Chỉ Chi Tiết
                                </h2>
                            </div>
                        </CardHeader>
                        <CardBody className="p-6">
                            <WarehouseAddressForm
                                data={formData}
                                onChange={handleChange}
                            />
                        </CardBody>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="bordered"
                            onClick={() => navigate("/admin/warehouses")}
                            startContent={<Icon icon="mdi:arrow-left" />}
                        >
                            Quay lại
                        </Button>

                        <Button
                            type="submit"
                            color="primary"
                            isLoading={loading}
                            startContent={<Icon icon="mdi:content-save" />}
                        >
                            Tạo warehouse
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWarehousePage;