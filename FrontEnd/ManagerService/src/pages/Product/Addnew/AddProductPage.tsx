import { Card, CardHeader, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import ProductPreview from "@/components/Admin/Product/Thumbnail/ProductPreview.tsx";
import ProductForm from "@/components/Admin/Product/Form/ProductForm.tsx";
import {ProductCreate} from "@/zustand/Product.tsx";
import {useState} from "react";

const AddProductPage = () => {
const [formData, setFormData] = useState<ProductCreate>({
    category: "",
    description: "",
    maxStockLevel: 0,
    minStockLevel: 0,
    price: 0,
    productName: "",
    sku: "",
    supplier: "",
    unit: "",
    urlImageProduct: "",
});
const [warehouseIds, setWarehouseIds] = useState<string[]>([]);
    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Icon icon="mdi:package-variant-plus" className="text-3xl text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Thêm Sản Phẩm Mới
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Nhập thông tin chi tiết để tạo sản phẩm mới
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Thông Tin Sản Phẩm</h2>
                        </CardHeader>
                        <CardBody>
                            <ProductForm formData={formData}
                                         setformData={setFormData}
                                         warehouses={warehouseIds}
                                        setWarehouses={setWarehouseIds}
                            />
                        </CardBody>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Xem Trước</h2>
                        </CardHeader>
                        <CardBody>
                            <ProductPreview />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;