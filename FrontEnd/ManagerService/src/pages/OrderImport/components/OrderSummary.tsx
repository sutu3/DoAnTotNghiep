import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Textarea,
    Divider
} from "@heroui/react";
import { FileText, Send } from "lucide-react";
import { useImportOrderStore } from "@/zustand/importOrderStore.tsx";

interface OrderSummaryProps {
    onSubmit: () => void;
    loading: boolean;
    disabled: boolean;
    formData: { warehouse: string; note: string };
    setFormData: (data: any) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
                                                       onSubmit,
                                                       loading,
                                                       disabled,
                                                       formData,
                                                       setFormData
                                                   }) => {
    const { items } = useImportOrderStore();

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.requestQuantity * item.costUnitBase), 0);
    };

    const calculateTotalQuantity = () => {
        return items.reduce((total, item) => total + item.requestQuantity, 0);
    };

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
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Tóm Tắt Đơn Hàng</h2>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                {/* Order Statistics */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Số loại sản phẩm:</span>
                        <span className="font-medium">{items.length}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng số lượng:</span>
                        <span className="font-medium text-blue-600">
                            {calculateTotalQuantity()} đơn vị
                        </span>
                    </div>

                    <Divider />

                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Tổng giá trị:</span>
                        <span className="font-bold text-xl text-green-600">
                            {formatPrice(calculateTotal())}
                        </span>
                    </div>
                </div>

                <Divider />

                {/* Order Note */}
                <div>
                    <Textarea
                        label="Ghi chú đơn hàng"
                        placeholder="Nhập ghi chú cho đơn hàng..."
                        value={formData.note}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, note: e.target.value }))}
                        rows={3}
                        size="sm"
                    />
                </div>

                <Divider />

                {/* Submit Button */}
                <Button
                    color="primary"
                    size="lg"
                    fullWidth
                    onClick={onSubmit}
                    isLoading={loading}
                    isDisabled={disabled}
                    startContent={<Send className="w-5 h-5" />}
                    className="font-semibold"
                >
                    {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Nhập Hàng'}
                </Button>

                {/* Additional Info */}
                {items.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            💡 <strong>Lưu ý:</strong> Đơn hàng sẽ được gửi đến bộ phận phê duyệt.
                            Bạn có thể theo dõi trạng thái trong mục "Đơn hàng của tôi".
                        </p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default OrderSummary;