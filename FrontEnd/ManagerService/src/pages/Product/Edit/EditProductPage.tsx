// FrontEnd/ManagerService/src/pages/Product/Edit/EditProductPage.tsx
import  { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useSearchParams} from 'react-router-dom';
import ProductPreview from '@/components/Admin/Product/Thumbnail/ProductPreview.tsx';
import {ProductCreate, useProductStore} from '@/zustand/Product.tsx';
import ProductEditForm from '@/components/Admin/Product/Form/ProductEditForm';
import ProductWarehouseManager from "@/components/Admin/Product/ProductWarehouseManager.tsx";
import { useSelector} from "react-redux";
import {ProductSelector} from "@/Store/Selector.tsx";
import {Product} from "@/Store/ProductSlice.tsx";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";

const EditProductPage = () => {
    const [searchParams] = useSearchParams();
    const { product,setProduct } = useProductStore();

    const productId = searchParams.get("productId");
    const productSelect:Product[]=useSelector(ProductSelector);
    const [linkedWarehouses,setLinkedWarehouses]=useState<Warehouse[]>([]);
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
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        // Load product data và warehouse liên kết
        if (productId) {
            loadProductData(productId);
            loadLinkedWarehouses(productId);
        }
    }, [productId]);

    const loadProductData = async (id: string) => {
        if(productSelect.length!=0){
            const productFilter=productSelect.find((el:Product)=>el.productId==id)
            if(productFilter){
                console.log(productFilter)
                setFormData({
                    category: productFilter?.category?.categoryId,
                    description: productFilter?.description,
                    maxStockLevel: 0,
                    minStockLevel: 0,
                    price: productFilter?.price,
                    productName: productFilter?.productName,
                    sku: productFilter?.sku,
                    supplier: productFilter?.supplier?.supplierId,
                    unit: productFilter?.unit?.unitID,
                    urlImageProduct: productFilter?.urlImageProduct,
                })
                setProduct({
                    category: productFilter?.category?.categoryName,
                    description: productFilter?.description,
                    maxStockLevel: 0,
                    minStockLevel: 0,
                    price: productFilter?.price,
                    productName: productFilter?.productName,
                    sku: productFilter?.sku,
                    supplier: productFilter?.supplier?.supplierName,
                    unit: productFilter?.unit?.unitName,
                    urlImageProduct: productFilter?.urlImageProduct,
                })
            }
        }
        // API call để load thông tin sản phẩm
        // Sử dụng pattern tương tự như trong ProductThunk
    };

    const loadLinkedWarehouses = async (id: string) => {
        const getLinkedWarehouses = async (productId: string) => {
            try {
                const response:ApiResponse<Warehouse[]> = await fetchApi({method:"GET",url:API_ROUTES.inventory.InventoryWarehouse(null).search().byProductId(productId).getProduct,body:undefined,headers:undefined});
                const data = response.result;

                // Extract unique warehouse IDs from the response
                const warehouseIds:Warehouse[] = data.map((item: any) => item.warehouseDetails);
                return [...new Set(warehouseIds)]; // Remove duplicates
            } catch (error) {
                console.error('Failed to load linked warehouses:', error);
                return [];
            }
        };
        const linked = await getLinkedWarehouses(id);
        setLinkedWarehouses(linked)
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Icon icon="mdi:package-variant-edit" className="text-3xl text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Chỉnh Sửa Sản Phẩm
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Cập nhật thông tin sản phẩm và quản lý warehouse liên kết
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <Tabs
                                selectedKey={activeTab}
                                onSelectionChange={(key) => setActiveTab(key as string)}
                                className="w-full"
                            >
                                <Tab key="info" title="Thông Tin Sản Phẩm" />
                                <Tab key="warehouses" title="Quản Lý Warehouse" />
                            </Tabs>
                        </CardHeader>
                        <CardBody>
                            {activeTab === "info" && (
                                <ProductEditForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    productId={productId}
                                />
                            )}
                            {activeTab === "warehouses" && (
                                <ProductWarehouseManager
                                    productId={productId}
                                    linkedWarehouses={linkedWarehouses}
                                    setLinkedWarehouses={setLinkedWarehouses}
                                />
                            )}
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

export default EditProductPage;