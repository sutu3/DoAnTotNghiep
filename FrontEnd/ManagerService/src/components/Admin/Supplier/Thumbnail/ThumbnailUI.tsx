import React from 'react';
import {Image} from "@heroui/react";
import {UserIcon} from "lucide-react";
import useSupplierStore from "@/zustand/Supplier.tsx";

// Định nghĩa kiểu dữ liệu cho Supplier để sử dụng trong props

interface SupplierThumbnailProps {
    onClick?: () => void; // Optional: handle click event on the thumbnail
    className?: string; // Optional: add custom classes to the container
}

const SupplierThumbnail: React.FC<SupplierThumbnailProps> = ({  onClick, className }) => {
    const { supplier } = useSupplierStore();
    const formatAddressParts = (street: string | null | undefined, district: string | number | null | undefined, country: string | number | null | undefined, fullAddress: string | null | undefined): string => {
        if (fullAddress && fullAddress.length > 10 && (street || district || country)) {
            const parts = [street, district, country].filter(Boolean); // Remove null/undefined/empty strings
            return parts.length > 0 ? parts.join(', ') : fullAddress;
        }

        const parts = [street, district, country].filter(Boolean);
        if (fullAddress && fullAddress.length > 0 && parts.length === 0) return fullAddress;

        return parts.length > 0 ? parts.join(', ') : (fullAddress || '');
    };

    const addressText = formatAddressParts(supplier.street, supplier.district, supplier.country, supplier.address);
    return (
        <div
            className={`flex items-start h-36 p-4 border border-gray-200 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {/* Image/Icon Section */}
            <div className="w-16 h-16 flex-shrink-0 mr-4">
                {supplier.urlSupplier ? (
                    // Use Next.js Image component for fetched images
                        <Image
                            isZoomed
                            alt="HeroUI Fruit Image with Zoom"
                            src={supplier.urlSupplier}
                            width={240}
                        />
                ) : (
                    // Fallback icon if no image URL
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        <UserIcon className="w-10 h-10" /> {/* Or BuildingStorefrontIcon */}
                    </div>
                )}
            </div>

            {/* Text Info Section */}
            <div className="flex-grow">
                {/* Supplier Name */}
                <h3 className="text-lg font-semibold text-gray-800">
                    {supplier.supplierName || 'Untitled Supplier'}
                </h3>

                {/* Email (optional) */}
                {supplier.email && (
                    <p className="text-sm text-gray-600 mt-1 truncate">
                        Email: {supplier.email}
                    </p>
                )}

                {/* Phone Number (optional) */}
                {supplier.phoneNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                        Phone: {supplier.phoneNumber}
                    </p>
                )}

                {/* Address (formatted from available parts) */}
                {addressText && (
                    <p className="text-sm text-gray-600 mt-1">
                        Address: {addressText}
                    </p>
                )}

                {/* Warehouse ID (optional, might not fit in a typical thumbnail) */}
                {supplier.warehouses && (
                    <p className="text-xs text-gray-500 mt-1">
                        Warehouse: {supplier.warehouses}
                    </p>
                )}

            </div>

        </div>
    );
};

export default SupplierThumbnail;