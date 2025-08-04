import React, {useEffect, useRef, useState} from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Spinner, Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { InventoryWarehouse } from "@/Store/InventoryWarehouseSlice.tsx";
import StockMovementSlice, {StockMovement} from "@/Store/StockMovementSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllStockMovement} from "@/Store/Thunk/StockMovementThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {StockMovementSelector, TotalPageStockMovement} from "@/Store/Selector.tsx";
import StockMovementReport from "@/pages/Stack/Component/Print/StoreMovement.tsx";


interface StockMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    inventoryItem: InventoryWarehouse | null;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   inventoryItem
                                                               }) => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const movementList=useSelector(StockMovementSelector);
    const [loading, setLoading] = useState(false);
    const totalPage=useSelector(TotalPageStockMovement)
    const [pageNumber,setPageNumber]=useState(1);
    const dispatch=useDispatch()
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (!printRef.current) return;

        const checkSheetCode = inventoryItem?.inventoryWarehouseId || 'Không rõ mã phiếu';
        const printContents = printRef.current.innerHTML;

        const headerTitle = `<h1 style="text-align:center">Phiếu kiểm kho - ${checkSheetCode}</h1><hr/>`;
        const originalContents = document.body.innerHTML;
        const originalTitle = document.title;
        setTimeout(() => {
            window.print();
        }, 100);

        // Đánh dấu "đã in"


        const afterPrintHandler = () => {
            document.body.innerHTML = originalContents;
            document.title = originalTitle;
            window.location.reload();

            // Gọi đánh dấu
            // Hủy sự kiện sau khi dùng
            window.onafterprint = null;
        };

        window.onafterprint = afterPrintHandler;

        document.body.innerHTML = headerTitle + printContents;
        document.title = `Phiếu kiểm kho - ${checkSheetCode}`;
        window.print(); // Sau khi người dùng đóng hộp thoại in, `afterPrintHandler` sẽ chạy
    };


// Trong JSX


    useEffect(() => {
        if (isOpen && inventoryItem) {
            fetchStockMovements();
        }
    }, [isOpen, inventoryItem]);
    useEffect(() => {
        setMovements(movementList)
    }, [movementList]);
    const fetchStockMovements = async () => {
        if (!inventoryItem) return;

        setLoading(true);
        try {
            const page:pageApi={pageNumber:pageNumber-1,pageSize:5}
            dispatch(StockMovementSlice.actions.setStockMovementList([]))
            await (dispatch as any)(MiddleGetAllStockMovement(inventoryItem?.inventoryWarehouseId,page))
        } catch (error) {
            console.error("Error fetching stock movements:", error);
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    const getMovementTypeColor = (type: string) => {
        switch (type) {
            case "IMPORT": return "success";
            case "EXPORT": return "danger";
            case "ADJUSTMENT": return "warning";
            case "TRANSFER": return "primary";
            default: return "default";
        }
    };

    const getMovementTypeText = (type: string) => {
        switch (type) {
            case "IMPORT": return "Nhập kho";
            case "EXPORT": return "Xuất kho";
            case "ADJUSTMENT": return "Điều chỉnh";
            case "TRANSFER": return "Chuyển kho";
            default: return type;
        }
    };

    const getMovementIcon = (type: string) => {
        switch (type) {
            case "IMPORT": return "mdi:arrow-down-circle";
            case "EXPORT": return "mdi:arrow-up-circle";
            case "ADJUSTMENT": return "mdi:pencil-circle";
            case "TRANSFER": return "mdi:swap-horizontal-circle";
            default: return "mdi:circle";
        }
    };

    const columns = [
        { key: "movementType", label: "Loại giao dịch" },
        { key: "quantity", label: "Số lượng" },
        { key: "quantityChange", label: "Thay đổi" },
        { key: "performedBy", label: "Người thực hiện" },
        { key: "note", label: "Ghi chú" },
        { key: "createdAt", label: "Thời gian" }
    ];

    const renderCell = (movement: StockMovement, columnKey: string) => {
        switch (columnKey) {
            case "movementType":
                return (
                    <div className="flex items-center gap-2">
                        <Icon
                            icon={getMovementIcon(movement.movementType)}
                            className="text-lg"
                        />
                        <Chip
                            color={getMovementTypeColor(movement.movementType)}
                            variant="flat"
                            size="sm"
                        >
                            {getMovementTypeText(movement.movementType)}
                        </Chip>
                    </div>
                );
            case "quantity":
                return (
                    <div className="text-center">
                        <div className="font-semibold">{movement.quantity}</div>
                        <div className="text-xs text-gray-500">
                            {movement.quantityBefore} → {movement.quantityAfter}
                        </div>
                    </div>
                );
            case "quantityChange":
                const change = movement.quantityAfter - movement.quantityBefore;
                return (
                    <div className={`text-center font-semibold ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {change > 0 ? '+' : ''}{change}
                    </div>
                );
            case "performedBy":
                return (
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:account-circle" className="text-gray-500" />
                        <span>{movement.performedByUser?.userName || 'N/A'}</span>
                    </div>
                );
            case "note":
                return (
                    <div className="max-w-xs truncate" title={movement.note}>
                        {movement.note || '-'}
                    </div>
                );
            case "createdAt":
                return (
                    <div className="text-sm">
                        <div>{new Date(movement.createdAt||"N/A").toLocaleDateString('vi-VN')}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(movement.createdAt||"N/A").toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                );
            default:
                return movement[columnKey as keyof StockMovement];
        }
    };
    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pageNumber}
                total={totalPage}
                onChange={setPageNumber}
            />
        </div>
    );

    return (
        <Modal
            size="4xl"
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <Icon icon="mdi:history" className="text-2xl text-blue-600" />
                    <div>
                        <h3 className="text-xl font-semibold">Lịch Sử Giao Dịch Kho</h3>
                        <p className="text-sm text-gray-500">
                            {inventoryItem?.productDetails?.productName} - {inventoryItem?.binDetails?.binCode}
                        </p>
                    </div>
                </ModalHeader>

                <ModalBody>
                    {inventoryItem && (
                        <div className="space-y-4">
                            {/* Product Info Card */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Sản phẩm:</span>
                                        <p className="font-medium">{inventoryItem.productDetails?.productName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Vị trí:</span>
                                        <p className="font-medium">{inventoryItem.binDetails?.binCode}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Số lượng hiện tại:</span>
                                        <p className="font-medium text-blue-600">{inventoryItem.quantity}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                                        <Chip size="sm" color="success" variant="flat">
                                            {inventoryItem.status}
                                        </Chip>
                                    </div>
                                </div>
                            </div>

                            {/* Movements Table */}
                            <Table
                                bottomContent={bottomContent}
                                aria-label="Stock movements table"
                                classNames={{
                                    wrapper: "shadow-none border border-gray-200 dark:border-gray-700",
                                    th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                                    td: "py-3",
                                }}
                            >
                                <TableHeader columns={columns}>
                                    {(column) => (
                                        <TableColumn key={column.key}>
                                            {column.label}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    items={movements}
                                    emptyContent="Không có lịch sử giao dịch"
                                    isLoading={loading}
                                    loadingContent={<Spinner label="Đang tải..." />}
                                >
                                    {movements.map((movement,index) => (
                                        <TableRow key={index}>
                                            {(columnKey) => (
                                                <TableCell>
                                                    {renderCell(movement, columnKey as string)}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                        <div ref={printRef} className={"hidden"}>
                         <StockMovementReport
                            movement={movements}
                            inventoryWarehouse={inventoryItem}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Đóng
                    </Button>
                    <Button
                        color="primary"
                        startContent={<Icon icon="mdi:download" />}
                        onPress={handlePrint}
                    >
                        Xuất dữ liệu
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default StockMovementModal;