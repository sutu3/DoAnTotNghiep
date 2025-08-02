import React, {useState} from 'react';
import {
    Input,
    Textarea,
    Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {ProductCreate, useProductStore} from '@/zustand/Product';
import ImageUpload from './ImageUpload';
import UnitSelect from "@/components/Admin/Product/Select/UnitSelect.tsx";
import CategorySelect from "@/components/Admin/Product/Select/CategorySelect.tsx";
import SupplierSelect from "@/components/Admin/Product/Select/SupplierSelect.tsx";
import {MiddleUploadImage, UploadResponse} from "@/Store/Thunk/UploadThunk.tsx";
import {MiddleAddProduct} from "@/Store/Thunk/ProductThunk.tsx";
import {useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import WarehouseMultiSelect from '../Select/WarehouseMultiSelect';

interface Props {
    formData:ProductCreate;
    setformData:(formData: (prev: any) => any) => void;
    warehouses: string[]; // Thay vì string đơn
    setWarehouses:(warehouses: string[]) => void;
}
export default function ProductForm({formData,setformData,warehouses,setWarehouses}: Props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (key:string, value: string | number) => {
        setformData((prev: any) => ({ ...prev, [key]: value }));
    };
    const { product, updateField, resetProduct } = useProductStore();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic submit form
        setLoading(true);
        const imageResponse:UploadResponse=await (dispatch as any)(MiddleUploadImage());
        const newFormData:ProductCreate = {
            ...formData,
            productName: product.productName,
            description: product.description,
            price: product.price,
            sku: product.sku,
            supplier: formData.supplier,
            unit: formData.unit,
            maxStockLevel:product.maxStockLevel,
            minStockLevel:product.minStockLevel,
            category: formData.category,
            urlImageProduct: imageResponse.urlImage
        };
        await (dispatch as any)(MiddleAddProduct(newFormData,warehouses));

        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate("/admin/products");
        setLoading(false)
        console.log('Product data:', product);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm"
                    value={product.productName || ''}
                    onChange={(e) => updateField('productName', e.target.value)}
                    isRequired
                />

                <Input
                    label="Mã SKU"
                    placeholder="Nhập mã SKU"
                    value={product.sku || ''}
                    onChange={(e) => updateField('sku', e.target.value)}
                    isRequired
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
            <WarehouseMultiSelect
                warehouseList={warehouses}
                setWarehouseList={(key:string[])=>setWarehouses(key)}
            />

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
                    onClick={resetProduct}
                    startContent={<Icon icon="mdi:refresh" />}
                >
                    Đặt lại
                </Button>

                <Button
                    type="submit"
                    color="primary"
                    isLoading={loading}
                    startContent={<Icon icon="mdi:content-save" />}
                >
                    Lưu sản phẩm
                </Button>
            </div>
        </form>
    );
};

