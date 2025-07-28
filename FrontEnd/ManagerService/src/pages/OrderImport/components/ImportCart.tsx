import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Avatar,
    Chip
} from "@heroui/react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useImportOrderStore } from "@/zustand/importOrderStore.tsx";

const ImportCart: React.FC = () => {
    const { items, removeItemByIndex } = useImportOrderStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Giỏ Hàng</h2>
                    <Chip color="primary" variant="flat" size="sm">
                        {items.length}
                    </Chip>
                </div>
            </CardHeader>
            <CardBody className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Chưa có sản phẩm nào</p>
                        <p className="text-gray-400 text-xs">Thêm sản phẩm từ danh sách bên trái</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                <div className="flex items-start gap-3">
                                    <Avatar
                                        size="sm"
                                        fallback={<ShoppingCart className="w-4 h-4" />}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm text-gray-900 truncate">
                                            {item.productName}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {item.supplierName || "N/A"}
                                        </p>

                                        <div className="mt-2 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Số lượng:</span>
                                                <span className="font-medium">
                                                    {item.requestQuantity} {item.unitName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Đơn giá:</span>
                                                <span className="font-medium">
                                                    {formatPrice(item.costUnitBase)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm font-semibold text-blue-600 pt-1 border-t">
                                                <span>Thành tiền:</span>
                                                <span>
                                                    {formatPrice(item.requestQuantity * item.costUnitBase)}
                                                </span>
                                            </div>
                                        </div>

                                        {item.note && (
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                                "{item.note}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onClick={() => removeItemByIndex(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default ImportCart;