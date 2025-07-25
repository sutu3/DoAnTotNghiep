import React from 'react';
import { Button, Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { ArrowLeft, Building2 } from 'lucide-react';

interface PageHeaderProps {
    supplierName?: string;
    loading?: boolean;
    onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ supplierName, loading, onBack }) => {
    return (
        <div className="mb-6">
            <Breadcrumbs className="mb-4">
                <BreadcrumbItem onClick={onBack}>
                    Nhà cung cấp
                </BreadcrumbItem>
                <BreadcrumbItem>{supplierName || "Chỉnh sửa"}</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex items-center justify-between">
                {loading&&
                    <div className="flex items-center gap-4">

                        <Button
                            isIconOnly
                            variant="light"
                            onClick={onBack}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {supplierName || "Chỉnh sửa nhà cung cấp"}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Cập nhật thông tin chi tiết của nhà cung cấp
                            </p>
                        </div>
                    </div>
            }

            </div>
        </div>
    );
};

export default PageHeader;