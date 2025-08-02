// FrontEnd/ManagerService/src/pages/WarehouseDelivery/components/DeliveryCart.tsx
import { Card, CardBody, CardHeader, Button, Input, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useWarehouseDeliveryStore } from "@/zustand/warehouseDeliveryStore";

export default function DeliveryCart() {
    const { items, removeItem, updateQuantity } = useWarehouseDeliveryStore();
    console.log(items);
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:clipboard-list" className="text-xl text-orange-600" />
                        <h3 className="text-lg font-semibold">Phiếu Xuất Kho</h3>
                    </div>
                    <Chip color="primary" variant="flat">
                        {items.length} sản phẩm
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Icon icon="mdi:clipboard-outline" className="text-4xl mb-2" />
                        <p>Chưa có sản phẩm nào</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <Card key={index} className="border">
                                <CardBody className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{item?.product?.productName}</p>
                                            <p className="text-xs text-gray-500">
                                                Bin: {item.bin?.binCode} | SKU: {item?.product?.sku}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    value={item?.realityQuantity.toString()}
                                                    onValueChange={(value) =>
                                                        updateQuantity(index, parseFloat(value) || 0)
                                                    }
                                                    className="w-20"
                                                    min={0.001}
                                                    max={item.quantity}
                                                    step="0.001"
                                                />
                                                <span className="text-xs text-gray-500">
                                                    {item.unit?.unitName}
                                                </span>
                                            </div>
                                            <p className="text-xs text-orange-600 font-medium mt-1">
                                                {(item.realityQuantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                            </p>
                                            {item.note && (
                                                <p className="text-xs text-gray-400 mt-1 italic">
                                                    {item.note}
                                                </p>
                                            )}
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