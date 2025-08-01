import { Card, CardBody, CardHeader, Chip, Divider, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import DeliveryReceiptPrintable from "@/pages/ExecuteExport/Component/Print/DeliveryReceiptPrintable.tsx";
import {Button} from "@heroui/button";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {useRef} from "react";

interface DeliveryDetailViewProps {
    delivery: any;
    onBack: () => void;
}

export default function DeliveryDetailView({ delivery, onBack,  }: DeliveryDetailViewProps) {
    const componentRef = useRef<HTMLDivElement>(null);

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
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };


    return (
        <div className="space-y-6">
            {/* Header với navigation */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3 justify-between">
                        <Button onClick={onBack}>
                            Back
                        </Button>
                        <Chip color={getStatusColor(delivery.status)} variant="flat" size="lg">
                            {getStatusText(delivery.status)}
                        </Chip>
                        <div className="flex justify-end gap-2 no-print">
                            <Button
                                color="primary"
                                startContent={<Icon icon="mdi:file-pdf" />}
                                onPress={exportToPDF}
                            >
                                Xuất PDF
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Thông tin phiếu xuất - tương tự DeliverySummary nhưng read-only */}

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-3">
                        {/* Thông tin đơn hàng gốc */}
                        <Card className="border-l-2 border-l-blue-500 mb-6">
                            <CardHeader>
                                <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                                    <Icon icon="mdi:clipboard-list" className="text-lg" />
                                    Thông Tin Đơn Xuất Gốc
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Mã đơn xuất:</p>
                                        <p className="font-semibold">#{delivery.exportOrder?.exportOrderId?.slice(-8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Khách hàng:</p>
                                        <p className="font-semibold">{delivery.exportOrder?.customer?.supplierName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Kho xuất:</p>
                                        <p className="font-semibold">{delivery.exportOrder?.warehouse?.warehouseName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Người tạo đơn:</p>
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                src={delivery.exportOrder?.createByUser?.urlImage}
                                                name={delivery.exportOrder?.createByUser?.userName}
                                                size="sm"
                                            />
                                            <span className="font-semibold text-xs">
                                            {delivery.exportOrder?.createByUser?.userName}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Danh sách sản phẩm đã xuất */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Icon icon="mdi:package-variant" className="text-orange-600" />
                                    Sản Phẩm Đã Xuất ({delivery.deliveryItems?.length || 0})
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {delivery.deliveryItems?.map((item: any, index: number) => (
                                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Sản phẩm:</p>
                                                    <p className="font-medium">{item.exportItem?.product?.productName}</p>
                                                    <p className="text-xs text-gray-500">SKU: {item.exportItem?.product?.sku}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Số lượng xuất:</p>
                                                    <p className="font-medium">{item.deliveredQuantity} {item.exportItem?.unit?.unitName}</p>
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
                        {/* Thông tin phiếu xuất */}
                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                            <CardHeader>
                                <h3 className="font-semibold flex items-center gap-2 text-orange-800">
                                    <Icon icon="mdi:file-document" className="text-orange-600" />
                                    Thông Tin Phiếu Xuất
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Mã phiếu:</span>
                                        <code className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                                            #{delivery.deliveryId?.slice(-8)}
                                        </code>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Người tạo phiếu:</span>
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                src={delivery.createdByUser?.urlImage}
                                                name={delivery.createdByUser?.userName}
                                                size="sm"
                                            />
                                            <span className="font-medium text-sm">
                                            {delivery.createdByUser?.userName}
                                        </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Ngày tạo:</span>
                                        <span className="font-medium">
                                        {delivery.deliveryDate &&
                                            new Date(delivery.deliveryDate).toLocaleString('vi-VN')
                                        }
                                    </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Tổng sản phẩm:</span>
                                        <span className="font-semibold text-lg">
                                        {delivery.deliveryItems?.length || 0} sản phẩm
                                    </span>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">Tổng giá trị:</span>
                                        <span className="font-bold text-2xl text-orange-600">
                                        {delivery.exportOrder?.totalAmount?.toLocaleString('vi-VN')} ₫
                                    </span>
                                    </div>
                                </div>

                                {delivery.notes && (
                                    <>
                                        <Divider />
                                        <div>
                                            <p className="text-sm text-gray-700 mb-2">Ghi chú:</p>
                                            <div className="bg-white p-3 rounded border">
                                                <p className="text-sm">{delivery.notes}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardBody>
                        </Card>

                        {/* Footer phiếu - read only */}
                        <Card className="bg-gray-50">
                            <CardBody>
                                <div className="grid grid-cols-2 gap-8 text-center text-sm">
                                    <div>
                                        <p className="font-semibold mb-2">Người tạo phiếu</p>
                                        <div className="flex flex-col items-center gap-2">
                                            <Avatar
                                                src={delivery.createdByUser?.urlImage}
                                                name={delivery.createdByUser?.userName}
                                                size="md"
                                            />
                                            <p className="text-xs text-gray-500 font-medium">
                                                {delivery.createdByUser?.userName}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-2">Người nhận hàng</p>
                                        <div className="flex flex-col items-center gap-2">
                                            <Avatar
                                                src={delivery.exportOrder?.customer?.urlSupplier}
                                                name={delivery.exportOrder?.customer?.supplierName}
                                                size="md"
                                            />
                                            <p className="text-xs text-gray-500 font-medium">
                                                {delivery.exportOrder?.customer?.supplierName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="my-4" />

                                <div className="text-center text-xs text-gray-500">
                                    <p>Phiếu xuất kho - Hệ thống quản lý kho</p>
                                    <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            {false&&<DeliveryReceiptPrintable
                delivery={delivery}
                onExportPDF={()=>console.log("Export PDF")}
            />}
        </div>
    );
}


