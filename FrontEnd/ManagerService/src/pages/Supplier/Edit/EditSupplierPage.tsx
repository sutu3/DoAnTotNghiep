// pages/Supplier/Edit/page.tsx
import  { useState, useEffect } from 'react';
import {useParams, useNavigate, useSearchParams} from 'react-router-dom';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import {  useSelector } from 'react-redux';

import { SupplierSelector} from '@/Store/Selector';
import PageHeader from "@/components/Admin/Supplier/PageHeader.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";
import SupplierEditForm from "@/components/Admin/Supplier/Form/SupplierEditForm .tsx";
import SupplierPreview from "@/components/Admin/Supplier/SupplierPreview.tsx";

const EditSupplierPage = () => {
    const { supplierId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const stackId = searchParams.get("supplierId");
    const stackDisplay = useSelector(SupplierSelector).find((el: { supplierId: string | null; }) => el.supplierId == stackId);
    const suppliers = useSelector(SupplierSelector);
    const [supplier, setSupplier] = useState<Supplier>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load supplier data
        if (stackDisplay) {
            setSupplier(stackDisplay);
        }
    }, [supplierId, suppliers,stackDisplay]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    supplierName={supplier?.supplierName}
                    loading={loading}
                    onBack={() => navigate('/admin/suppliers')}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section (2/3) */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:account-edit" className="text-2xl text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Chỉnh sửa thông tin nhà cung cấp
                                    </h2>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <SupplierEditForm
                                    supplier={supplier}
                                    onUpdate={setSupplier}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    {/* Preview Section (1/3) */}
                    <div className="lg:col-span-1">
                        <SupplierPreview supplier={supplier} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSupplierPage;