"use client";
import {  useState } from "react";
import {Input, NumberInput, Textarea} from "@heroui/react";
import {useFileStore} from "@/zustand/File.tsx";
import {ProductCreate, useProductStore} from "@/zustand/Product.tsx";
import CategorySelect from "@/components/Admin/Product/Select/CategorySelect.tsx";
import UnitSelect from "@/components/Admin/Product/Select/UnitSelect.tsx";
import SupplierSelect from "@/components/Admin/Product/Select/SupplierSelect.tsx";

interface Props {
    formData:ProductCreate;
    setformData:(formData: (prev: any) => any) => void;
}
export default function ProductForm({formData,setformData}: Props) {
    const { product, setProduct } = useProductStore();
    const {setFile} =useFileStore();


    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


// Fetch wards when district changes

    const handleChange = (key:string, value: string | number) => {
        setformData((prev: any) => ({ ...prev, [key]: value }));
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setProduct({urlImageProduct: url});
        }
    };

    return (
        <div className="space-y-6 p-2 max-w-5xl mx-auto">
            {/* Image Upload */}
            <div className="flex items-center gap-2">
                <div className="w-full">
                    <Input
                        aria-labelledby="Input"
                        label="Upload Image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="w-24 h-24 border rounded overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-xs text-gray-400">Preview</span>
                    )}
                </div>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    aria-labelledby="Input"
                    label="Product Name"
                    placeholder="Enter product name"
                    value={product.productName}
                    onValueChange={(val) => setProduct({productName: val})}
                />
                <Input
                    aria-labelledby="Input"
                    label="SKU"
                    placeholder="Enter SKU"
                    value={product.sku}
                    onValueChange={(val) => setProduct({sku: val})}
                />
                <NumberInput
                    aria-labelledby="Input"
                    value={product.price}
                    onValueChange={(val) => setProduct({price: val})}
                    placeholder="Enter the amount"
                />
                <SupplierSelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}                />
            </div>
            <Textarea
                aria-labelledby="Input"
                label="Description"
                placeholder="Enter product description"
                value={product.description}
                onChange={(e) => setProduct({description: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategorySelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}                />
                <UnitSelect
                    setFormData={(key, value) => handleChange(key, value)}
                    formData={formData}                />
            </div>



            {/* Province */}


        </div>
    );
}
