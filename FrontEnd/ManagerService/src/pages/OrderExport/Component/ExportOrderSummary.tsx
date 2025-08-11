import { Card, CardBody, CardHeader, Input, Textarea, Button, Divider, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {useExportOrderStore} from "@/zustand/ExportOrderStore.tsx";

interface ExportOrderSummaryProps {
    formData: any;
    setFormData: (formData: (prev: any) => any) => void;
    onSubmit: () => void;
    loading: boolean;
    disabled: boolean;
}

export default function ExportOrderSummary({ formData, setFormData, onSubmit, loading, disabled }: ExportOrderSummaryProps) {
    const { items } = useExportOrderStore();

    const totalAmount = items.reduce((sum, item) => sum + (item.requestQuantity * item.unitPrice), 0);
    const totalItems = items.reduce((sum, item) => sum + item.requestQuantity, 0);

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:clipboard-text" className="text-xl text-orange-600" />
                    <h3 className="text-lg font-semibold">Thông Tin Đơn Hàng</h3>
                </div>
            </CardHeader>

            <CardBody className="space-y-4">
                <Input
                    type="date"
                    label="Ngày giao hàng"
                    value={formData.deliveryDate}
                    onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, deliveryDate: value }))
                    }
                    startContent={<Icon icon="mdi:calendar" />}
                />

                <Textarea
                    label="Mô tả đơn hàng"
                    placeholder="Nhập mô tả cho đơn xuất hàng..."
                    value={formData.description}
                    onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, description: value }))
                    }
                    minRows={3}
                />

                <Divider />

                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Tổng Quan Đơn Hàng</h4>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tổng sản phẩm:</span>
                            <Chip color="primary" variant="flat" size="sm">
                                {items.length} loại
                            </Chip>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tổng số lượng:</span>
                            <span className="font-semibold">{totalItems}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tổng giá trị:</span>
                            <span className="font-bold text-green-600">
                                {totalAmount.toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                    </div>
                </div>

                <Divider />

                <Button
                    color="primary"
                    size="lg"
                    className="w-full"
                    onPress={onSubmit}
                    isLoading={loading}
                    isDisabled={disabled}
                    startContent={!loading && <Icon icon="mdi:check-circle" />}
                >
                    {loading ? "Đang tạo đơn..." : "Tạo Đơn Xuất Hàng"}
                </Button>
            </CardBody>
        </Card>
    );
}