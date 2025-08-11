import { useState, useEffect, useRef } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Card, CardBody, CardHeader, Button, Input, Chip, Pagination,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {
    InventoryCheckSheet,
    setCheckSheets,
    setTotalPage
} from '@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx';
import CheckSheetPrintTemplate from '@/pages/InventoryCheck/Components/Print/CheckSheetPrintTemplate.tsx';
import { InventoryCheckSelector } from '@/pages/InventoryCheck/Store/Selector.tsx';
import {
    MiddleGetWarehouseByUser,
    MiddleUpdateStatusCompleteCheckSheets
} from "@/pages/InventoryCheck/Store/Thunk/InventoryCheckSheetThunk.tsx";
import SelectWarehouseDeliveryFilter from "@/pages/InventoryCheck/Components/Select/WarehouseSelect.tsx";
interface CheckSheetListTabProps {
    onCreateNew:()=>void;
    onViewDetail:(checkSheet: InventoryCheckSheet)=>void;
    onEditCheckSheet:(checkSheet: InventoryCheckSheet)=>void;
}
const CheckSheetListTab = ({onEditCheckSheet,onViewDetail,onCreateNew}:CheckSheetListTabProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCheckSheet, setSelectedCheckSheet] = useState<InventoryCheckSheet | null>(null);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const printRef = useRef<HTMLDivElement>(null);
    const [warehouse,setWarehouse] = useState("");
    const checkSheets: InventoryCheckSheet[] = useSelector(InventoryCheckSelector);
    useEffect(() => {
        setLoading(true);
        const fetchCheckSheets = async () => {
            dispatch(setCheckSheets([]));
            dispatch(setTotalPage(0));
            const pageData = { pageNumber: currentPage - 1, pageSize: itemsPerPage };
             await (dispatch as any)(MiddleGetWarehouseByUser(warehouse,pageData));
            setLoading(false);
        };
        if(warehouse!=""){
            fetchCheckSheets();
        }
    }, [dispatch, warehouse]);

    const columns = [
        { key: 'checkSheetNumber', label: 'Số Phiếu' },
        { key: 'warehouseInfo', label: 'Kho' },
        { key: 'performedBy', label: 'Người Thực Hiện' },
        { key: 'checkDate', label: 'Ngày Kiểm Kê' },
        { key: 'status', label: 'Trạng Thái' },
        { key: 'summary', label: 'Tóm Tắt' },
        { key: 'actions', label: 'Thao Tác' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'warning';
            case 'COMPLETED': return 'primary';
            case 'APPROVED': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Nháp';
            case 'COMPLETED': return 'Hoàn Thành';
            case 'APPROVED': return 'Đã Duyệt';
            default: return status;
        }
    };

    const handlePrintCheckSheet = (checkSheet: InventoryCheckSheet) => {
        setSelectedCheckSheet(checkSheet);
        setIsPrintModalOpen(true);
    };
    const handlePrint = () => {
        if (!printRef.current) return;

        const checkSheetCode = selectedCheckSheet?.checkSheetNumber || 'Không rõ mã phiếu';
        const printContents = printRef.current.innerHTML;

        const headerTitle = `<h1 style="text-align:center">Phiếu kiểm kho - ${checkSheetCode}</h1><hr/>`;
        const originalContents = document.body.innerHTML;
        const originalTitle = document.title;

        // Đánh dấu "đã in"
        const markAsPrinted = () => {
            const fetchUpdate=async ()=>{
                await (dispatch as any)(MiddleUpdateStatusCompleteCheckSheets(selectedCheckSheet))
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



    const renderCell = (item: InventoryCheckSheet, columnKey: string) => {
        switch (columnKey) {
            case 'checkSheetNumber':
                return <span className="font-medium text-sm">{item.checkSheetNumber}</span>;
            case 'warehouseInfo':
                return <span>{item.warehouseDetails?.warehouseName || 'N/A'}</span>;
            case 'performedBy':
                return <span>{item.performedByDetails?.userName || item.performedBy}</span>;
            case 'checkDate':
                return new Date(item.checkDate).toLocaleDateString('vi-VN');
            case 'status':
                return (
                    <Chip color={getStatusColor(item.status)} variant="flat" size="sm">
                        {getStatusText(item.status)}
                    </Chip>
                );
            case 'summary':
                const total = item.checkDetails?.length || 0;
                const diff = item.checkDetails?.filter(d => d.difference !== 0)?.length || 0;
                return <span>{total} SP, {diff} lệch</span>;
            case 'actions':
                return (
                    <div className="flex gap-2">
                        <Button size="sm" variant="flat" onClick={() => handlePrintCheckSheet(item)}>
                            <Icon icon="mdi:printer" className="mr-1" /> In
                        </Button>
                        <Button size="sm" variant="flat" onClick={()=>onViewDetail(item)}>
                            <Icon icon="mdi:eye-outline" className="mr-1" /> Chi Tiết
                        </Button>
                        <Button size="sm" variant="flat" onClick={() => onEditCheckSheet(item)}>
                            <Icon icon="mdi:pencil-outline" className="mr-1" /> Sửa
                        </Button>
                    </div>
                );

            default:
                return item[columnKey as keyof InventoryCheckSheet];
        }
    };

    const filtered = checkSheets?.filter(sheet =>
        sheet.checkSheetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.performedByDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.warehouseDetails?.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginated = filtered?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm phiếu kiểm..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    startContent={<Icon icon="mdi:magnify" />}
                />
                <SelectWarehouseDeliveryFilter warehouse={warehouse} setWarehouse={setWarehouse}/>
                <Button color="primary" startContent={<Icon icon="mdi:plus" />} onPress={onCreateNew}>Tạo Phiếu</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-lg font-semibold">Danh Sách Phiếu Kiểm Kê</div>
                </CardHeader>
                <CardBody className="p-0">
                    <Table aria-label="Inventory Table">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải sản phẩm..." />}
                            emptyContent="Không có dữ liệu.">
                            {paginated?.map((item) => (
                                <TableRow key={item.checkSheetId}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-between items-center px-4 py-2">
                        <Pagination
                            total={Math.ceil(filtered?.length / itemsPerPage)}
                            page={currentPage}
                            onChange={setCurrentPage}
                            size="sm"
                            showControls
                        />
                        <span className="text-sm text-gray-500">
              {`Hiển thị ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filtered?.length)} / ${filtered?.length}`}
            </span>
                    </div>
                </CardBody>
            </Card>

            <Modal size="5xl" isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>In Phiếu Kiểm Kê</ModalHeader>
                    <ModalBody>
                        {selectedCheckSheet && (
                            <div ref={printRef}>
                                <CheckSheetPrintTemplate checkSheet={selectedCheckSheet} />
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
        </div>
    );
};

export default CheckSheetListTab;
