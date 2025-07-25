import React from 'react';
import { Card, CardBody, Chip, Divider } from "@heroui/react";
import { Building2, MapPin, Phone, Mail, Package, Truck } from "lucide-react";
import useSupplierStore from "@/zustand/Supplier.tsx";

interface SupplierThumbnailProps {
    onClick?: () => void;
    className?: string;
}

const SupplierThumbnail: React.FC<SupplierThumbnailProps> = ({ onClick, className }) => {
    const { supplier } = useSupplierStore();

    const formatAddressParts = (street: string | null | undefined, district: string | number | null | undefined, country: string | number | null | undefined, fullAddress: string | null | undefined): string => {
        if (fullAddress && fullAddress.length > 10 && (street || district || country)) {
            const parts = [street, district, country].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : fullAddress;
        }
        const parts = [street, district, country].filter(Boolean);
        if (fullAddress && fullAddress.length > 0 && parts.length === 0) return fullAddress;
        return parts.length > 0 ? parts.join(', ') : (fullAddress || '');
    };

    const addressText = formatAddressParts(supplier.street, supplier.district, supplier.country, supplier.address);

    return (
        <Card
            className={`h-full hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
            onClick={onClick}
        >
            <CardBody className="p-6">
                {/* Header với icon và status */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-4">
                        {supplier.urlSupplier ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                <img
                                    src={supplier.urlSupplier}
                                    alt={supplier.supplierName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        )}
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
                            startContent={<Package className="w-3 h-3" />}
                        >
                            Đang hoạt động
                        </Chip>
                    </div>
                </div>

                <Divider className="mb-6" />

                {/* Thông tin chi tiết với warehouse style */}
                <div className="space-y-4">
                    {/* Email */}
                    {supplier.email && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                                <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
                    {addressText && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Địa chỉ
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {addressText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Divider className="my-6" />

                {/* Action area hoặc stats */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Nhà cung cấp tin cậy</span>
                    <Chip size="sm" variant="dot" color="success">
                        Đã xác minh
                    </Chip>
                </div>
            </CardBody>
        </Card>
    );
};

export default SupplierThumbnail;