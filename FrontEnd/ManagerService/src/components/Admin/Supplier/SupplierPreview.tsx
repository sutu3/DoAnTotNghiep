import React from 'react';
import {Card, CardBody, Chip, Divider} from '@heroui/react';
import {Building2, MapPin, Phone, Mail, Package} from 'lucide-react';
import {Supplier} from "@/Store/SupplierSlice.tsx";

interface SupplierPreviewProps {
    supplier?: Supplier | undefined
}

const SupplierPreview: React.FC<SupplierPreviewProps> = ({supplier}) => {
    if (!supplier) {
        return (
            <Card className="h-full">
                <CardBody className="p-6 flex items-center justify-center">
                    <p className="text-gray-500">Chọn nhà cung cấp để xem preview</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardBody className="p-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-4">
                        <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {supplier.supplierName || 'Nhà cung cấp'}
                    </h3>
                    <div className="flex gap-2">
                        <Chip
                            color="success"
                            variant="flat"
                            size="md"
                            className="font-medium"
                            startContent={<Package className="w-3 h-3"/>}
                        >
                            Đang hoạt động
                        </Chip>
                    </div>
                </div>

                <Divider className="mb-6"/>

                {/* Thông tin chi tiết */}
                <div className="space-y-4">
                    {/* Email */}
                    {supplier.email && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <Mail className="w-4 h-4 text-green-600 dark:text-green-400"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Email liên hệ
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                    {supplier.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {supplier.phoneNumber && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Số điện thoại
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {supplier.phoneNumber}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {supplier.address && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Địa chỉ
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {supplier.address}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Divider className="my-6"/>

                {/* Statistics hoặc additional info */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Trạng thái</span>
                        <Chip size="sm" color="success" variant="dot">
                            Đã xác minh
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Loại nhà cung cấp</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            Doanh nghiệp
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default SupplierPreview;