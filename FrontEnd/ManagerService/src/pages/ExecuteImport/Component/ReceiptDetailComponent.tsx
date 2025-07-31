"use client";

import {  useRef } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Avatar,
    Divider
} from "@heroui/react";
import { WarehouseReceiptResponse } from "../Store/WarehouseReceiptSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {ArrowLeft, ClipboardList, FileDown, FileEdit, FileText} from "lucide-react";
import ImportReceiptPrintable from "@/pages/ExecuteImport/Component/Print/ImportReceiptPrintable.tsx";

interface ReceiptDetailComponentProps {
    receipt: WarehouseReceiptResponse;
    onEdit: () => void;
    onBack:()=>void;
}

export default function ImportReceiptDetailView({ receipt,onBack, onEdit }: ReceiptDetailComponentProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    console.log("Receipt Detail View", receipt);
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
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header với navigation */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={onBack}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div className="bg-blue-600 rounded-lg p-2">
                                    <FileText className="text-xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Chi Tiết Phiếu Nhập Kho</h2>
                                    <p className="text-sm text-gray-600">
                                        #{receipt.receiptId?.slice(-8)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Chip
                                    color={getStatusColor(receipt.status)}
                                    variant="flat"
                                    size="lg"
                                >
                                    {getStatusText(receipt.status)}
                                </Chip>

                                <Button
                                    color="secondary"
                                    variant="flat"
                                     startContent={<FileDown className="text-lg" />}
                                    onPress={exportToPDF}
                                    className="no-print"
                                >
                                    Xuất PDF
                                </Button>

                                {receipt.status === 'PENDING' && onEdit && (
                                    <Button
                                        color="primary"
                                        startContent={<FileEdit className="text-lg" />}
                                        onPress={onEdit}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Nội dung chi tiết */}
                <div ref={componentRef} className="print-content">
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-3">
                            {/* Thông tin đơn nhập gốc */}
                            <Card className="border-l-2 border-l-green-500 mb-6">
                                <CardHeader>
                                    <h3 className="font-semibold flex items-center gap-2 text-green-700">
                                        <ClipboardList className="text-lg" />
                                        Thông Tin Đơn Nhập Gốc
                                    </h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Mã đơn nhập:</p>
                                            <p className="font-semibold">#{receipt.importOrder?.importOrderId?.slice(-8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Kho nhập:</p>
                                            <p className="font-semibold">{receipt.importOrder?.warehouse?.warehouseName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Người tạo đơn:</p>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={receipt.importOrder?.createByUser?.urlImage}
                                                    name={receipt.importOrder?.createByUser?.userName}
                                                    size="sm"
                                                />
                                                <span className="font-semibold text-xs">
                                                    {receipt.importOrder?.createByUser?.userName}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Người duyệt:</p>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={receipt.importOrder?.accessByAdmin?.urlImage}
                                                    name={receipt.importOrder?.accessByAdmin?.userName}
                                                    size="sm"
                                                />
                                                <span className="font-semibold text-xs">
                                                    {receipt.importOrder?.accessByAdmin?.userName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Danh sách sản phẩm đã nhập */}
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <FileText className="text-blue-600" />
                                        Sản Phẩm Đã Nhập ({receipt.receiptItems?.length || 0})
                                    </h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-4">
                                        {receipt.receiptItems?.map((item: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Sản phẩm:</p>
                                                        <p className="font-medium">{item.importItem?.product?.productName}</p>
                                                        <p className="text-xs text-gray-500">SKU: {item.importItem?.product?.sku}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Số lượng nhập:</p>
                                                        <p className="font-medium">{item.receivedQuantity} {item.importItem?.unit?.unitName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Vị trí bin:</p>
                                                        <p className="font-medium">{item.binDetails?.binCode}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Ghi chú:</p>
                                                        <p className="font-medium">{item.note || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="xl:col-span-2 space-y-6">
                            {/* Thông tin phiếu nhập */}
                            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
                                <CardHeader>
                                    <h3 className="font-semibold flex items-center gap-2 text-blue-800">
                                        {/*<Icon icon="mdi:file-document" className="text-blue-600" />*/}
                                        Thông Tin Phiếu Nhập
                                    </h3>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-700">Mã phiếu:</span>
                                            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                #{receipt.receiptId?.slice(-8)}
                                            </code>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-700">Người tạo phiếu:</span>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={receipt.createdByUser?.urlImage}
                                                    name={receipt.createdByUser?.userName}
                                                    size="sm"
                                                />
                                                <span className="font-medium text-sm">
                                                    {receipt.createdByUser?.userName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-700">Ngày nhập:</span>
                                            <span className="font-medium">
                                                {receipt.receivedDate &&
                                                    new Date(receipt.receivedDate).toLocaleString('vi-VN')
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-700">Tổng sản phẩm:</span>
                                            <span className="font-semibold text-lg">
                                                {receipt.receiptItems?.length || 0} sản phẩm
                                            </span>
                                        </div>
                                        <Divider />
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-800">Tổng giá trị:</span>
                                            <span className="font-bold text-2xl text-blue-600">
                                                {receipt.importOrder?.totalPrice?.toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                    </div>

                                    {receipt.note && (
                                        <>
                                            <Divider />
                                            <div>
                                                <p className="text-sm text-gray-700 mb-2">Ghi chú:</p>
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="text-sm">{receipt.note}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Footer phiếu */}
                            <Card className="bg-gray-50">
                                <CardBody>
                                    <div className="grid grid-cols-2 gap-8 text-center text-sm">
                                        <div>
                                            <p className="font-semibold mb-2">Người tạo phiếu</p>
                                            <div className="flex flex-col items-center gap-2">
                                                <Avatar
                                                    src={receipt.createdByUser?.urlImage}
                                                    name={receipt.createdByUser?.userName}
                                                    size="md"
                                                />
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {receipt.createdByUser?.userName}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold mb-2">Thủ kho</p>
                                            <div className="flex flex-col items-center gap-2">
                                                <Avatar
                                                    name="Thủ kho"
                                                    size="md"
                                                />
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Ký tên và đóng dấu
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider className="my-4" />

                                    <div className="text-center text-xs text-gray-500">
                                        <p>Phiếu nhập kho - Hệ thống quản lý kho</p>
                                        <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <ImportReceiptPrintable
                receipt={receipt}
                onExportPDF={() => console.log('PDF exported successfully')}
            />
        </div>
    );
}
