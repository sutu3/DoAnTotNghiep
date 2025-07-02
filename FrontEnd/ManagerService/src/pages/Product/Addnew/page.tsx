"use client";

import SupplierForm from "@/components/Form/SupplierForm.tsx";
import ThumbnailUI from "@/components/Admin/Supplier/Thumbnail/ThumbnailUI.tsx";
import {Button, Spinner} from "@heroui/react";
import {useState} from "react";
import {useProductStore} from "@/zustand/Product.tsx";

export default function AddNewProductPage() {
    const {product}=useProductStore();
    const [loading, setLoading] = useState(false);
    const hanldAddNewSupplier = async ()=>{
        setLoading(true);
        /*const imageResponse:UploadResponse=await (dispatch as any)(MiddleUploadImage());
        setSupplier({urlSupplier:imageResponse.urlImage})
        await (dispatch as any)(MiddleAddSupplier(supplier));

        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate("/admin/suppliers");*/
        setLoading(false)
    }
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Supplier Form - chiếm 2/3 */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Supplier</h1>
                    <SupplierForm />
                </div>

                {/* Right: Supplier Summary Card - chiếm 1/3 */}
                <div className="md:col-span-1  gap-5   p-6 flex flex-col items-center">
                    {product.urlImageProduct ? (
                        <ThumbnailUI/>
                    ) : (
                        <p className="text-gray-400 text-sm">Upload an image to preview</p>
                    )}
                    <Button disabled={loading} className="w-full bg-primary text-white" onClick={hanldAddNewSupplier}>
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
