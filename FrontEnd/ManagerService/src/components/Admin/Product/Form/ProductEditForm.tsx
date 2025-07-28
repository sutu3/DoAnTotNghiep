import React, { useState } from 'react';
import {
    Input,
    Textarea,
    Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { ProductCreate, useProductStore } from '@/zustand/Product';
import ImageUpload from './ImageUpload';
import UnitSelect from "@/components/Admin/Product/Select/UnitSelect.tsx";
import CategorySelect from "@/components/Admin/Product/Select/CategorySelect.tsx";
import SupplierSelect from "@/components/Admin/Product/Select/SupplierSelect.tsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {MiddleUploadImage, UploadResponse} from "@/Store/Thunk/UploadThunk.tsx";
import {MiddleUpdateProduct} from "@/Store/Thunk/ProductThunk.tsx";

interface Props {
    formData: ProductCreate;
    setFormData: (formData: (prev: any) => any) => void;
    productId?: string;
}

export default function ProductEditForm({ formData, setFormData, productId }: Props) {
    console.log(formData)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, updateField } = useProductStore();

    const handleChange = (key: string, value: string | number) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = product?.urlImageProduct;

            if (formData?.urlImageProduct != product?.urlImageProduct) {
                const imageResponse: UploadResponse = await (dispatch as any)(MiddleUploadImage());
                imageUrl = imageResponse?.urlImage || imageUrl;
            }

            const updateData: ProductCreate = {
                ...formData,
                productName: product.productName,
                description: product.description,
                price: product.price,
                sku: product.sku,
                maxStockLevel: product.maxStockLevel,
                minStockLevel: product.minStockLevel,
                urlImageProduct: imageUrl,
            };

            await (dispatch as any)(MiddleUpdateProduct(productId || "", updateData));
            navigate("/admin/products");
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm"
                    value={product?.productName}
                    onChange={(e) => updateField('productName', e.target.value)}
                    isRequired
                />

                <Input
                    label="Mã SKU"
                    placeholder="Nhập mã SKU"
                    value={product.sku || ''}
                    onChange={(e) => updateField('sku', e.target.value)}
                    isRequired
                    isDisabled // SKU thường không cho phép sửa
                />
            </div>

            <Textarea
                label="Mô tả sản phẩm"
                placeholder="Nhập mô tả chi tiết về sản phẩm"
                value={product.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                minRows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type="number"
                    label="Giá bán (VNĐ)"
                    placeholder="0"
                    value={product.price?.toString() || ''}
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">₫</span>
                        </div>
                    }
                    isRequired
                />

                <UnitSelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategorySelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}
                />

                <SupplierSelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type="number"
                    label="Mức tồn kho tối thiểu"
                    placeholder="0"
                    value={product.minStockLevel?.toString() || ''}
                    onChange={(e) => updateField('minStockLevel', parseInt(e.target.value) || 0)}
                />

                <Input
                    type="number"
                    label="Mức tồn kho tối đa"
                    placeholder="0"
                    value={product.maxStockLevel?.toString() || ''}
                    onChange={(e) => updateField('maxStockLevel', parseInt(e.target.value) || 0)}
                />
            </div>

            <ImageUpload
                value={product.urlImageProduct || ''}
                onChange={(url) => updateField('urlImageProduct', url)}
            />

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="bordered"
                    onClick={() => navigate("/admin/products")}
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
                    Cập nhật sản phẩm
                </Button>
            </div>
        </form>
    );
}