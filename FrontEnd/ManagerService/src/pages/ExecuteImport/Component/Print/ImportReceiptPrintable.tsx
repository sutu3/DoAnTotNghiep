import { Button, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {WarehouseReceiptResponse} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";

interface ImportReceiptPrintableProps {
    receipt: WarehouseReceiptResponse;
    onExportPDF?: () => void;
}

export default function ImportReceiptPrintable({ receipt, onExportPDF }: ImportReceiptPrintableProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const exportToPDF = async () => {
        if (componentRef.current) {
            try {
                const canvas = await html2canvas(componentRef.current, {
                    scale: 1.5,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth;
                const imgHeight = (canvas.height * pdfWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }

                pdf.save(`Phieu-nhap-kho-${receipt.receiptId?.slice(-8)}.pdf`);
                onExportPDF?.();
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    const calculateTotalValue = () => {
        return receipt.receiptItems?.reduce((total: number, item: any) => {
            return total + (item.receivedQuantity * (item.importItem?.costUnitBase || 0));
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
                <div className="text-center mb-8 border-b-2 border-blue-500 pb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="bg-blue-600 rounded-full p-3">
                            <Icon icon="mdi:warehouse" className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">HỆ THỐNG QUẢN LÝ KHO</h1>
                            <p className="text-lg text-gray-600">Warehouse Management System</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>Địa chỉ: {receipt.importOrder?.warehouse?.warehouseName}</p>
                        <p>Điện thoại: (028) 1234-5678 | Email: warehouse@company.com</p>
                    </div>
                </div>

                {/* Document Title */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-blue-600 mb-2">PHIẾU NHẬP KHO</h2>
                    <p className="text-xl text-gray-700">WAREHOUSE RECEIPT</p>
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-semibold">Số phiếu: <span className="text-blue-600">#{receipt.receiptId?.slice(-8)}</span></p>
                        </div>
                        <div>
                            <Chip color="success" variant="flat" size="lg">
                                Hoàn thành
                            </Chip>
                        </div>
                    </div>
                </div>

                {/* Main Information Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Order Info */}
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:clipboard-list" />
                                THÔNG TIN ĐƠN NHẬP
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã đơn nhập:</span>
                                    <span>#{receipt.importOrder?.importOrderId?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người tạo đơn:</span>
                                    <span>{receipt.importOrder?.createByUser?.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người duyệt:</span>
                                    <span>{receipt.importOrder?.accessByAdmin?.userName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:warehouse" />
                                THÔNG TIN KHO
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Tên kho:</span>
                                    <span>{receipt.importOrder?.warehouse?.warehouseName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã kho:</span>
                                    <span>{receipt.importOrder?.warehouse?.warehouseId?.slice(-8)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Receipt Info */}
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                                <Icon icon="mdi:file-document" />
                                THÔNG TIN PHIẾU NHẬP
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày tạo phiếu:</span>
                                    <span>{new Date(receipt.receivedDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Giờ tạo:</span>
                                    <span>{new Date(receipt.receivedDate).toLocaleTimeString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Người tạo phiếu:</span>
                                    <span>{receipt.createdByUser?.userName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Items Table */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Icon icon="mdi:package-variant" className="text-blue-600" />
                        DANH SÁCH SẢN PHẨM NHẬP ({receipt.receiptItems?.length || 0} sản phẩm)
                    </h3>

                    <table className="w-full border-collapse border border-gray-400 text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-3 text-left">STT</th>
                            <th className="border border-gray-400 p-3 text-left">SẢN PHẨM</th>
                            <th className="border border-gray-400 p-3 text-center">SL NHẬP</th>
                            <th className="border border-gray-400 p-3 text-center">ĐƠN VỊ</th>
                            <th className="border border-gray-400 p-3 text-right">ĐƠN GIÁ</th>
                            <th className="border border-gray-400 p-3 text-right">THÀNH TIỀN</th>
                            <th className="border border-gray-400 p-3 text-center">VỊ TRÍ</th>
                            <th className="border border-gray-400 p-3 text-left">GHI CHÚ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {receipt.receiptItems?.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-400 p-3 text-center">{index + 1}</td>
                                <td className="border border-gray-400 p-3">
                                    <div>
                                        <p className="font-medium">{item.importItem?.product?.productName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">SKU: {item.importItem?.product?.sku || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="border border-gray-400 p-3 text-center font-semibold">
                                    {item.receivedQuantity}
                                </td>
                                <td className="border border-gray-400 p-3 text-center">
                                    {item.importItem?.unit?.unitName || 'N/A'}
                                </td>
                                <td className="border border-gray-400 p-3 text-right">
                                    {(item.importItem?.costUnitBase || 0).toLocaleString('vi-VN')} ₫
                                </td>
                                <td className="border border-gray-400 p-3 text-right font-semibold">
                                    {((item.receivedQuantity || 0) * (item.importItem?.costUnitBase || 0)).toLocaleString('vi-VN')} ₫
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
                                    <span className="font-semibold">{receipt.receiptItems?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng số lượng nhập:</span>
                                    <span className="font-semibold">
                                        {receipt.receiptItems?.reduce((total: number, item: any) =>
                                            total + (item.receivedQuantity || 0), 0) || 0}
                                    </span>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold">Tổng giá trị:</span>
                                    <span className="font-bold text-blue-600">
                                        {calculateTotalValue().toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                            </div>
                        </div>

                        {receipt.note && (
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-4">GHI CHÚ</h4>
                                <div className="bg-white p-4 rounded border text-sm">
                                    {receipt.note}
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
                                <p className="font-medium">{receipt.createdByUser?.userName}</p>
                                <p className="text-xs text-gray-500">{receipt.createdByUser?.email}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">NHÀ CUNG CẤP</h4>
                            <div className="h-20 mb-4"></div>
                            <div className="border-t border-gray-400 pt-2">
                                <p className="font-medium">_________________</p>
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
                    <p>Phiếu nhập kho được tạo tự động bởi Hệ thống Quản lý Kho</p>
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