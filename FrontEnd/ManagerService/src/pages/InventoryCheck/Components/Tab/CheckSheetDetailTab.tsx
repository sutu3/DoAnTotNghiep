import React, {useRef, useState} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Divider,
    Avatar,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import {InventoryCheckDetail, InventoryCheckSheet} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";
import {MiddleUpdateStatusCompleteCheckSheets} from "@/pages/InventoryCheck/Store/Thunk/InventoryCheckSheetThunk.tsx";
import { useDispatch } from 'react-redux';
import CheckSheetPrintTemplate from "@/pages/InventoryCheck/Components/Print/CheckSheetPrintTemplate.tsx";

interface CheckSheetDetailTabProps {
    checkSheet: InventoryCheckSheet;
    onBack: () => void;
    onEdit: () => void;
}

const CheckSheetDetailTab: React.FC<CheckSheetDetailTabProps> = ({
                                                                     checkSheet,
                                                                     onBack,
                                                                     onEdit
                                                                 }) => {
    const dispatch=useDispatch();
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'default';
            case 'COMPLETED': return 'warning';
            case 'APPROVED': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Nháp';
            case 'COMPLETED': return 'Hoàn thành';
            case 'APPROVED': return 'Đã duyệt';
            default: return status;
        }
    };

    const calculateTotalDifference = () => {
        return checkSheet.checkDetails?.reduce((total: number, item: any) =>
            total + (item.difference || 0), 0) || 0;
    };

    const getVarianceItems = () => {
        return checkSheet.checkDetails?.filter((item: any) => item.difference !== 0) || [];
    };
    const handlePrintCheckSheet = () => {
        setIsPrintModalOpen(true);
    };
    const handlePrint = () => {
        if (!printRef.current) return;

        const checkSheetCode = checkSheet?.checkSheetNumber || 'Không rõ mã phiếu';
        const printContents = printRef.current.innerHTML;

        const headerTitle = `<h1 style="text-align:center">Phiếu kiểm kho - ${checkSheetCode}</h1><hr/>`;
        const originalContents = document.body.innerHTML;
        const originalTitle = document.title;

        // Đánh dấu "đã in"
        const markAsPrinted = () => {
            const fetchUpdate=async ()=>{
                await (dispatch as any)(MiddleUpdateStatusCompleteCheckSheets(checkSheet))
            }
            fetchUpdate()
        };

        const afterPrintHandler = () => {
            document.body.innerHTML = originalContents;
            document.title = originalTitle;
            window.location.reload();

            // Gọi đánh dấu
            markAsPrinted();

            // Hủy sự kiện sau khi dùng
            window.onafterprint = null;
        };

        window.onafterprint = afterPrintHandler;

        document.body.innerHTML = headerTitle + printContents;
        document.title = `Phiếu kiểm kho - ${checkSheetCode}`;
        window.print(); // Sau khi người dùng đóng hộp thoại in, `afterPrintHandler` sẽ chạy
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <Button isIconOnly variant="light" onPress={onBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="bg-indigo-600 rounded-lg p-2">
                                <Icon icon="mdi:clipboard-text" className="text-xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Chi Tiết Phiếu Kiểm Kê
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {checkSheet.checkSheetNumber}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Chip
                                color={getStatusColor(checkSheet.status)}
                                variant="flat"
                                size="lg"
                                startContent={
                                    <Icon
                                        icon={
                                            checkSheet.status === 'DRAFT' ? 'mdi:pencil' :
                                                checkSheet.status === 'COMPLETED' ? 'mdi:check' :
                                                    'mdi:check-all'
                                        }
                                    />
                                }
                            >
                                {getStatusText(checkSheet.status)}
                            </Chip>

                            {checkSheet.attachmentUrl && (
                                <Button
                                    color="secondary"
                                    variant="flat"
                                    startContent={<FileText className="w-4 h-4" />}
                                    onPress={() => window.open(checkSheet.attachmentUrl, '_blank')}
                                >
                                    Xem file đính kèm
                                </Button>
                            )}

                            <Button size="sm" variant="flat" onClick={() => handlePrintCheckSheet()}>
                                <Icon icon="mdi:printer" className="mr-1" /> In
                            </Button>

                            {checkSheet.status !== 'COMPLETED' && (
                                <Button
                                    color="primary"
                                    startContent={<Edit className="w-4 h-4" />}
                                    onPress={onEdit}
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Thông tin phiếu kiểm kê */}
                <div className="xl:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="mdi:information" className="text-blue-600" />
                                Thông Tin Phiếu Kiểm Kê
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Mã phiếu:</span>
                                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                        {checkSheet.checkSheetNumber}
                                    </code>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Kho kiểm tra:</span>
                                    <span className="font-medium">
                                        {checkSheet.warehouseDetails?.warehouseName || 'N/A'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Người thực hiện:</span>
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            src={checkSheet.performedByDetails?.urlImage}
                                            name={checkSheet.performedByDetails?.userName}
                                            size="sm"
                                        />
                                        <span className="font-medium text-sm">
                                            {checkSheet.performedByDetails?.userName}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Thời gian kiểm:</span>
                                    <span className="font-medium">
                                        {new Date(checkSheet.checkDate).toLocaleString('vi-VN')}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tổng sản phẩm:</span>
                                    <span className="font-semibold text-lg">
                                        {checkSheet.checkDetails?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {checkSheet.notes && (
                                <>
                                    <Divider />
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Ghi chú:</p>
                                        <div className="bg-gray-50 p-3 rounded border">
                                            <p className="text-sm">{checkSheet.notes}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardBody>
                    </Card>

                    {/* Tóm tắt chênh lệch */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="mdi:chart-line" className="text-orange-600" />
                                Tóm Tắt Chênh Lệch
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {checkSheet.checkDetails?.filter((item:  InventoryCheckDetail) => item.difference > 0).length || 0}
                                    </div>
                                    <div className="text-xs text-green-700">Thừa</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {checkSheet.checkDetails?.filter((item:  InventoryCheckDetail) => item.difference < 0).length || 0}
                                    </div>
                                    <div className="text-xs text-red-700">Thiếu</div>
                                </div>
                            </div>

                            <Divider />

                            <div className="text-center">
                                <div className="text-sm text-gray-600">Tổng chênh lệch:</div>
                                <div className={`text-xl font-bold ${
                                    calculateTotalDifference() === 0 ? 'text-gray-600' :
                                        calculateTotalDifference() > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {calculateTotalDifference() > 0 ? '+' : ''}{calculateTotalDifference()}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Chi tiết sản phẩm kiểm kê */}
                <div className="xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="mdi:package-variant" className="text-purple-600" />
                                Chi Tiết Sản Phẩm Kiểm Kê ({checkSheet.checkDetails?.length || 0})
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <Table
                                aria-label="Check details table"
                                classNames={{
                                    wrapper: "shadow-none border border-gray-200 rounded-lg",
                                    th: "bg-gray-50 text-gray-700 font-semibold",
                                    td: "py-3 border-b border-gray-100",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>SẢN PHẨM</TableColumn>
                                    <TableColumn>VỊ TRÍ</TableColumn>
                                    <TableColumn>SL HỆ THỐNG</TableColumn>
                                    <TableColumn>SL THỰC TẾ</TableColumn>
                                    <TableColumn>CHÊNH LỆCH</TableColumn>
                                    <TableColumn>LÝ DO</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {(checkSheet.checkDetails || []).map((item:  InventoryCheckDetail, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-semibold">{item?.inventoryWarehouseDetails?.productDetails?.productName}</p>
                                                    <p className="text-xs text-gray-500">SKU: {item?.inventoryWarehouseDetails?.productDetails?.sku}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="sm" variant="flat">
                                                    {item.inventoryWarehouseDetails?.binDetails?.binCode}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-blue-600">
                                                    {item.systemQuantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold">
                                                    {item.actualQuantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    color={
                                                        item.difference === 0 ? 'default' :
                                                            item.difference > 0 ? 'success' : 'danger'
                                                    }
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {item.difference > 0 ? '+' : ''}{item.difference}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {item.adjustmentReason || '-'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                    {/* Sản phẩm có chênh lệch */}
                    {getVarianceItems().length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700">
                                    <Icon icon="mdi:alert-circle" className="text-orange-600" />
                                    Sản Phẩm Có Chênh Lệch ({getVarianceItems().length})
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    {getVarianceItems().map((item: InventoryCheckDetail, index: number) => (
                                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-orange-800">
                                                        {item?.inventoryWarehouseDetails?.productDetails?.productName}
                                                    </p>
                                                    <p className="text-sm text-orange-600">
                                                        Vị trí: {item.inventoryWarehouseDetails?.binDetails?.binCode} | SKU: {item?.inventoryWarehouseDetails?.productDetails?.sku}
                                                    </p>
                                                </div>
                                                <Chip
                                                    color={item.difference > 0 ? 'success' : 'danger'}
                                                    variant="flat"
                                                >
                                                    {item.difference > 0 ? '+' : ''}{item.difference}
                                                </Chip>
                                            </div>
                                            {item.adjustmentReason && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-orange-700">
                                                        <strong>Lý do:</strong> {item.adjustmentReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
            <Modal size="4xl" isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>In Phiếu Kiểm Kê</ModalHeader>
                    <ModalBody>
                        {checkSheet && (
                            <div ref={printRef}>
                                <CheckSheetPrintTemplate checkSheet={checkSheet} />
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsPrintModalOpen(false)}>
                            Đóng
                        </Button>
                        <Button color="primary" onPress={handlePrint}>
                            <Icon icon="mdi:printer" className="mr-1" /> In Phiếu
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Footer Actions */}
        </div>
    );
};

export default CheckSheetDetailTab;