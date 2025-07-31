import { Button, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface DeliveryReceiptPrintableProps {
    delivery: any;
    onExportPDF?: () => void;
}

export default function DeliveryReceiptPrintable({ delivery, onExportPDF }: DeliveryReceiptPrintableProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const exportToPDF = async () => {
        if (componentRef.current) {
            try {
                // Tăng scale để có chất lượng tốt hơn
                const canvas = await html2canvas(componentRef.current, {
                    scale: 1.5, // Giảm scale để tránh quá lớn
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    height: componentRef.current.scrollHeight, // Sử dụng scrollHeight
                    width: componentRef.current.scrollWidth
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth;
                const imgHeight = (canvas.height * pdfWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                // Thêm trang đầu tiên
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;

                // Thêm các trang tiếp theo nếu cần
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }

                pdf.save(`Phieu-xuat-kho-${delivery.deliveryId?.slice(-8)}.pdf`);
                onExportPDF?.();
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_PROGRESS': return 'primary';
            case 'COMPLETED': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'IN_PROGRESS': return 'Đang xử lý';
            case 'COMPLETED': return 'Hoàn thành';
            default: return status;
        }
    };

    const calculateTotalValue = () => {
        return delivery.deliveryItems?.reduce((total: number, item: any) => {
            return total + (item.deliveredQuantity * (item.exportItem?.unitPrice || 0));
        }, 0) || 0;
    };

    return (
        <div className="space-y-4">
            {/* Control buttons */}
            <div className="flex justify-end gap-2 no-print">
                <Button
                    color="primary"
                    startContent={<Icon icon="mdi:file-pdf" />}
                    onPress={exportToPDF}
                >
                    Xuất PDF
                </Button>
            </div>

            {/* Printable content */}
            <div ref={componentRef} className="bg-white p-8 min-h-[297mm] w-[210mm] mx-auto shadow-lg print-content">
                {/* Header - Company Info */}
                <div className="text-center mb-8 border-b-2 border-orange-500 pb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="bg-orange-600 rounded-full p-3">
                            <Icon icon="mdi:warehouse" className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">HỆ THỐNG QUẢN LÝ KHO</h1>
                            <p className="text-lg text-gray-600">Warehouse Management System</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>Địa chỉ: {delivery.exportOrder?.warehouse?.warehouseName}</p>
                        <p>Điện thoại: (028) 1234-5678 | Email: warehouse@company.com</p>
                    </div>
                </div>

                {/* Document Title */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-orange-600 mb-2">PHIẾU XUẤT KHO</h2>
                    <p className="text-xl text-gray-700">WAREHOUSE DELIVERY RECEIPT</p>
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-semibold">Số phiếu: <span className="text-orange-600">#{delivery.deliveryId?.slice(-8)}</span></p>
                        </div>
                        <div>
                            <Chip color={getStatusColor(delivery.status)} variant="flat" size="lg">
                                {getStatusText(delivery.status)}
                            </Chip>
                        </div>
                    </div>
                </div>

                {/* Main Information Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Order Info */}
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:clipboard-list" />
                                THÔNG TIN ĐỢN XUẤT
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã đơn xuất:</span>
                                    <span>#{delivery.exportOrder?.exportOrderId?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày tạo đơn:</span>
                                    <span>{delivery.exportOrder?.deliveryDate ?
                                        new Date(delivery.exportOrder.deliveryDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người tạo đơn:</span>
                                    <span>{delivery.exportOrder?.createByUser?.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người duyệt:</span>
                                    <span>{delivery.exportOrder?.approvedBy?.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày duyệt:</span>
                                    <span>{delivery.exportOrder?.approvedDate ?
                                        new Date(delivery.exportOrder.approvedDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:warehouse" />
                                THÔNG TIN KHO
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Tên kho:</span>
                                    <span>{delivery.exportOrder?.warehouse?.warehouseName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã kho:</span>
                                    <span>{delivery.exportOrder?.warehouse?.warehouseId?.slice(-8)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customer & Delivery Info */}
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:account-group" />
                                THÔNG TIN KHÁCH HÀNG
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium">Tên công ty:</span>
                                    <p className="mt-1">{delivery.exportOrder?.customer?.supplierName}</p>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã khách hàng:</span>
                                    <span>{delivery.exportOrder?.customer?.supplierId?.slice(-8)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:truck-delivery" />
                                THÔNG TIN PHIẾU XUẤT
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày tạo phiếu:</span>
                                    <span>{new Date(delivery.deliveryDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Giờ tạo:</span>
                                    <span>{new Date(delivery.deliveryDate).toLocaleTimeString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người tạo phiếu:</span>
                                    <span>{delivery.createdByUser?.userName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Items Table */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Icon icon="mdi:package-variant" className="text-orange-600" />
                        DANH SÁCH SẢN PHẨM XUẤT ({delivery.deliveryItems?.length || 0} sản phẩm)
                    </h3>

                    <table className="w-full border-collapse border border-gray-400 text-sm delivery-table">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-3 text-left">STT</th>
                            <th className="border border-gray-400 p-3 text-left">SẢN PHẨM</th>
                            <th className="border border-gray-400 p-3 text-center">SL XUẤT</th>
                            <th className="border border-gray-400 p-3 text-center">ĐƠN VỊ</th>
                            <th className="border border-gray-400 p-3 text-right">ĐƠN GIÁ</th>
                            <th className="border border-gray-400 p-3 text-right">THÀNH TIỀN</th>
                            <th className="border border-gray-400 p-3 text-center">VỊ TRÍ</th>
                            <th className="border border-gray-400 p-3 text-left">GHI CHÚ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {delivery.deliveryItems?.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-400 p-3 text-center">{index + 1}</td>
                                <td className="border border-gray-400 p-3">
                                    <div>
                                        <p className="font-medium">{item.exportItem?.product?.productName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">SKU: {item.exportItem?.product?.sku || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">Batch: {item.exportItem?.batchNumber || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="border border-gray-400 p-3 text-center font-semibold">
                                    {item.deliveredQuantity}
                                </td>
                                <td className="border border-gray-400 p-3 text-center">
                                    {item.exportItem?.unit?.unitName || 'N/A'}
                                </td>
                                <td className="border border-gray-400 p-3 text-right">
                                    {(item.exportItem?.unitPrice || 0).toLocaleString('vi-VN')} ₫
                                </td>
                                <td className="border border-gray-400 p-3 text-right font-semibold">
                                    {((item.deliveredQuantity || 0) * (item.exportItem?.unitPrice || 0)).toLocaleString('vi-VN')} ₫
                                </td>
                                <td className="border border-gray-400 p-3 text-center">
                                    {item.binDetails?.binCode || 'N/A'}
                                </td>
                                <td className="border border-gray-400 p-3 text-left">
                                    {item.note || '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="mb-8 bg-gray-50 p-6 rounded-lg summary-section">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">TỔNG KẾT</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Tổng số loại sản phẩm:</span>
                                    <span className="font-semibold">{delivery.deliveryItems?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng số lượng xuất:</span>
                                    <span className="font-semibold">
                        {delivery.deliveryItems?.reduce((total: number, item: any) =>
                            total + (item.deliveredQuantity || 0), 0) || 0}
                    </span>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold">Tổng giá trị:</span>
                                    <span className="font-bold text-orange-600">
                        {calculateTotalValue().toLocaleString('vi-VN')} ₫
                    </span>
                                </div>
                            </div>
                        </div>

                        {delivery.notes && (
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-4">GHI CHÚ</h4>
                                <div className="bg-white p-4 rounded border text-sm">
                                    {delivery.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Signature Section */}
                <div className="border-t-2 border-gray-300 pt-8 signature-section">
                <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <h4 className="font-bold mb-4">NGƯỜI TẠO PHIẾU</h4>
                            <div className="h-20 mb-4"></div>
                            <div className="border-t border-gray-400 pt-2">
                                <p className="font-medium">{delivery.createdByUser?.userName}</p>
                                <p className="text-xs text-gray-500">{delivery.createdByUser?.email}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">NGƯỜI NHẬN HÀNG</h4>
                            <div className="h-20 mb-4"></div>
                            <div className="border-t border-gray-400 pt-2">
                                <p className="font-medium">{delivery.exportOrder?.customer?.supplierName}</p>
                                <p className="text-xs text-gray-500">Ký tên và đóng dấu</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">THỦ KHO</h4>
                            <div className="h-20 mb-4"></div>
                            <div className="border-t border-gray-400 pt-2">
                                <p className="font-medium">_________________</p>
                                <p className="text-xs text-gray-500">Ký tên và đóng dấu</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
                    <p>Phiếu xuất kho được tạo tự động bởi Hệ thống Quản lý Kho</p>
                    <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                    <p className="mt-2">
                        <Icon icon="mdi:shield-check" className="inline mr-1" />
                        Phiếu này có giá trị pháp lý khi có đầy đủ chữ ký và đóng dấu
                    </p>
                </div>
            </div>
        </div>
    );
}