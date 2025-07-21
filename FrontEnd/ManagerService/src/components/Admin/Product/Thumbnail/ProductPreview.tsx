import { Card, CardBody, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useProductStore } from '@/zustand/Product';
import {useEffect, useState} from "react";
import { ResizeImageToFitFrame } from '@/Utils/ResizeImage';

const ProductPreview = () => {
    const { product } = useProductStore();
    const [imgSize, setImgSize] = useState({ width: 500, height: 250 });

    useEffect(() => {
        if (product.urlImageProduct) {
            ResizeImageToFitFrame(product.urlImageProduct, 600, 200).then(setImgSize);
        }
    }, [product.urlImageProduct]);

    if (!product.productName) {
        return (
            <div className="text-center text-gray-500 py-8">
                <Icon icon="mdi:package-variant" className="text-4xl mb-2" />
                <p>Nhập thông tin để xem trước sản phẩm</p>
            </div>
        );
    }

    return (
        <Card>
            <CardBody className="space-y-4">
                {product.urlImageProduct && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                            style={{
                                width: `${imgSize.width}px`,
                                height: `${imgSize.height}px`,
                                backgroundImage: `url(${product.urlImageProduct})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'contain',
                            }}
                            className="rounded m-auto flex-shrink-0"
                        />
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>

                {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {product.description}
                    </p>
                )}

                <Divider />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Giá bán:</span>
                        <span className="font-semibold text-green-600">
                            {product.price?.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>

                    {product.category && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Danh mục:</span>
                            <Chip size="sm" variant="flat">{product.category}</Chip>
                        </div>
                    )}

                    {product.supplier && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Nhà cung cấp:</span>
                            <span className="text-sm">{product.supplier}</span>
                        </div>
                    )}

                    {product.unit && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Đơn vị:</span>
                            <span className="text-sm">{product.unit}</span>
                        </div>
                    )}

                    {(product.minStockLevel || product.maxStockLevel) && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Tồn kho:</span>
                            <span className="text-sm">
                                {product.minStockLevel} - {product.maxStockLevel}
                            </span>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductPreview;
