"use client";

import {Button, Spinner} from "@heroui/react";
import {useState} from "react";
import {ProductCreate, useProductStore} from "@/zustand/Product.tsx";
import ProductForm from "@/components/Form/ProductForm.tsx";
import ProductThumbnail from "@/components/Admin/Product/Thumbnail/ThumbnailUI.tsx";
import {MiddleUploadImage, UploadResponse} from "@/Store/Thunk/UploadThunk.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddProduct} from "@/Store/Thunk/ProductThunk.tsx";
import {useNavigate} from "react-router-dom";

export default function AddNewProductPage() {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {product}=useProductStore();
    const [loading, setLoading] = useState(false);
    const [formData, setformData] = useState<ProductCreate>({
        category: "",
        createByUser: "",
        description: "",
        price: 0,
        productName: "",
        sku: "",
        supplier: "",
        unit: "",
        urlImageProduct: "",
        warehouses: ""
    });
    const hanldAddNewProduct = async ()=>{
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
            category: formData.category,
            urlImageProduct: imageResponse.urlImage
        };
        console.log(JSON.stringify(newFormData));
        await (dispatch as any)(MiddleAddProduct(newFormData));

        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate("/admin/products");
        setLoading(false)
    }
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Supplier Form - chiếm 2/3 */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Supplier</h1>
                    <ProductForm formData={formData} setformData={setformData}/>
                </div>

                {/* Right: Supplier Summary Card - chiếm 1/3 */}
                <div className="md:col-span-1  gap-5   p-6 flex flex-col items-center">
                    {product.urlImageProduct ? (
                        <ProductThumbnail/>
                    ) : (
                        <p className="text-gray-400 text-sm">Upload an image to preview</p>
                    )}
                    <Button disabled={loading} className="w-full bg-primary text-white" onClick={hanldAddNewProduct}>
                        {loading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <Spinner color="default" variant="dots" />
                                <span>Waiting Add</span>
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </Button>



                </div>
            </div>
        </div>
    );
}
