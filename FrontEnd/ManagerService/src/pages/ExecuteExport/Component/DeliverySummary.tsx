import { Card, CardBody, CardHeader, Textarea, Button, Divider, Chip,  Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useWarehouseDeliveryStore } from "@/zustand/warehouseDeliveryStore";
import { ExportOrder } from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface DeliverySummaryProps {
    exportOrder: ExportOrder | undefined;
    formData: any;
    setFormData: (formData: (prev: any) => any) => void;
    onSubmit: () => void;
    loading: boolean;
    disabled: boolean;
}

export default function DeliverySummary({ exportOrder, formData, setFormData, onSubmit, loading, disabled }: DeliverySummaryProps) {
    const { items } = useWarehouseDeliveryStore();

    const totalAmount = items.reduce((sum, item) => sum + (item.realityQuantity * item.unitPrice), 0);
    const totalItems = items.reduce((sum, item) => sum + item.realityQuantity, 0);

    return (
        <div className="space-y-6">
            {/* Header phiếu xuất - Professional */}
            <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-600 rounded-xl p-3 shadow-lg">
                                    <Icon icon="mdi:file-document-outline" className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">PHIẾU XUẤT KHO</h2>
                                    <p className="text-sm text-gray-600">Warehouse Delivery Receipt</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Số phiếu:</p>
                                <p className="font-mono text-lg font-bold text-orange-600">
                                    #{exportOrder?.exportOrderId?.slice(-8) || 'WD-' + Date.now().toString().slice(-6)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Ngày tạo:</p>
                                <p className="font-semibold">{new Date().toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Thời gian:</p>
                                <p className="font-semibold">{new Date().toLocaleTimeString('vi-VN')}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Trạng thái:</p>
                                <Chip color="warning" variant="flat" size="sm">Đang tạo</Chip>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Thông tin đơn hàng gốc - Compact */}
            {
                exportOrder&&<Card className="border-l-2 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                            <Icon icon="mdi:clipboard-list" className="text-lg" />
                            Thông Tin Đơn Xuất Gốc
                        </h3>
                    </CardHeader>
                    <CardBody className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Mã đơn xuất:</p>
                                <p className="font-semibold">#{exportOrder?.exportOrderId?.slice(-8) || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Khách hàng:</p>
                                <p className="font-semibold">{exportOrder?.customer?.supplierName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Kho xuất:</p>
                                <p className="font-semibold">{exportOrder?.warehouse?.warehouseName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Người tạo:</p>
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={exportOrder?.createByUser?.urlImage}
                                        name={exportOrder?.createByUser?.fullName}
                                        size="sm"
                                    />
                                    <span className="font-semibold text-xs">{exportOrder?.createByUser?.fullName || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

            }



            {/* Ghi chú và tổng kết */}
            {
                exportOrder&&<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ghi chú */}
                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold flex items-center gap-2">
                                <Icon icon="mdi:note-text" className="text-gray-600" />
                                Ghi Chú Phiếu Xuất
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <Textarea
                                placeholder="Nhập ghi chú cho phiếu xuất kho..."
                                value={formData.notes}
                                onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, notes: value }))
                                }
                                minRows={4}
                                variant="bordered"
                            />
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-700">
                                    💡 <strong>Lưu ý:</strong> Ghi chú sẽ được in trên phiếu xuất kho chính thức.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Tổng kết nâng cao */}
                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                        <CardHeader>
                            <h3 className="font-semibold flex items-center gap-2 text-orange-800">
                                <Icon icon="mdi:calculator" className="text-orange-600" />
                                Tổng Kết Phiếu Xuất
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Tổng số loại sản phẩm:</span>
                                    <Chip color="primary" variant="flat" size="sm">
                                        {items.length} loại
                                    </Chip>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Tổng số lượng xuất:</span>
                                    <span className="font-semibold text-lg">{totalItems.toFixed(3)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Giá trị trung bình/sản phẩm:</span>
                                    <span className="text-sm font-medium">
                                    {items.length > 0 ? (totalAmount / items.length).toLocaleString('vi-VN') : '0'} ₫
                                </span>
                                </div>
                                <Divider />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">Tổng giá trị xuất:</span>
                                    <span className="font-bold text-2xl text-orange-600">
                                    {totalAmount.toLocaleString('vi-VN')} ₫
                                </span>
                                </div>
                            </div>

                            <Divider />

                            <Button
                                color="primary"
                                size="lg"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 font-semibold shadow-lg"
                                onPress={onSubmit}
                                isLoading={loading}
                                isDisabled={disabled}
                                startContent={!loading && <Icon icon="mdi:truck-delivery" />}
                            >
                                {loading ? "Đang tạo phiếu..." : "Tạo Phiếu Xuất Kho"}
                            </Button>

                            {items.length > 0 && (
                                <div className="text-center text-xs text-orange-700">
                                    <Icon icon="mdi:information" className="inline mr-1" />
                                    Phiếu sẽ được tạo với {items.length} sản phẩm
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

            }

            {/* Footer phiếu - Enhanced */}
            {
                exportOrder&&<Card className="bg-gray-50 border-t-2 border-t-orange-500">
                    <CardBody>
                        <div className="grid grid-cols-3 gap-8 text-center text-sm">
                            <div>
                                <p className="font-semibold mb-2">Người tạo phiếu</p>
                                <div className="flex flex-col items-center gap-2">
                                    <Avatar
                                        src={exportOrder?.createByUser?.urlImage}
                                        name={exportOrder?.createByUser?.fullName}
                                        size="md"
                                    />
                                    <div className="h-8 border-b border-gray-400 w-24"></div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {exportOrder?.createByUser?.fullName || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold mb-2">Người nhận hàng</p>
                                <div className="h-16 border-b border-gray-400 mb-2 mx-8">
                                    <Avatar
                                        src={exportOrder?.customer?.urlSupplier}
                                        name={exportOrder?.customer?.supplierName}
                                        size="md"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                    {exportOrder?.customer?.supplierName || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {exportOrder?.customer?.phoneNumber || ''}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold mb-2">Thủ kho</p>
                                <div className="h-16 border-b border-gray-400 mb-2 mx-4"></div>
                                <p className="text-xs text-gray-500">Ký tên và đóng dấu</p>
                            </div>
                        </div>

                        <Divider className="my-4" />

                        <div className="text-center text-xs text-gray-500">
                            <p>Phiếu xuất kho được tạo tự động bởi hệ thống quản lý kho</p>
                            <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                            <p className="mt-1">
                                <Icon icon="mdi:shield-check" className="inline mr-1" />
                                Phiếu này có giá trị pháp lý khi có đầy đủ chữ ký
                            </p>
                        </div>
                    </CardBody>
                </Card>

            }
        </div>
    );
}