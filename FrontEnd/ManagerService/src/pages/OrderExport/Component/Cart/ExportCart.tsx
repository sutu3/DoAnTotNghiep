import { useExportOrderStore } from "@/zustand/ExportOrderStore";
import { Card, CardBody, CardHeader, Button, Input, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ExportCart() {
    const { items, removeItem, updateQuantity } = useExportOrderStore();

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:cart" className="text-xl text-green-600" />
                        <h3 className="text-lg font-semibold">Giỏ Xuất Hàng</h3>
                    </div>
                    <Chip color="primary" variant="flat">
                        {items.length} sản phẩm
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Icon icon="mdi:cart-outline" className="text-4xl mb-2" />
                        <p>Chưa có sản phẩm nào</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <Card key={index} className="border">
                                <CardBody className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{item.productName}</p>
                                            <p className="text-xs text-gray-500">
                                                Bin: {item.bin}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    value={item.requestQuantity.toString()}
                                                    onValueChange={(value) =>
                                                        updateQuantity(index, parseInt(value) || 0)
                                                    }
                                                    className="w-20"
                                                    min={1}
                                                    max={item.maxQuantity}
                                                />
                                                <span className="text-xs text-gray-500">
                                                    {item.unit}
                                                </span>
                                            </div>
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                {(item.requestQuantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            isIconOnly
                                            onPress={() => removeItem(index)}
                                        >
                                            <Icon icon="mdi:delete" />
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}