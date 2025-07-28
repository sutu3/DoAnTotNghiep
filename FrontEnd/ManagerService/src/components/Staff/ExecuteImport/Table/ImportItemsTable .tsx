import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Input,
    Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {getStatusFromBinAndQuantity} from "@/Utils/GetStatusOrder.tsx";

interface ImportItemsTableProps {
    warehouse:string
    items: ImportOrderItem[];
    onItemCheck: (itemId: string, actualQuantity: number) => void;
    onSelectLocation: (item: any) => void;
    onCompleteImport: () => void;
    loading: boolean;
}

export default function ImportItemsTable({warehouse,
                                             items,
                                             onItemCheck,
                                             onSelectLocation,
                                             onCompleteImport,
                                             loading
                                         }: ImportItemsTableProps) {

    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold">Danh Sách Sản Phẩm</h2>
            </CardHeader>
            <CardBody>
                <Table aria-label="Import items table">
                    <TableHeader>
                        <TableColumn>SẢN PHẨM</TableColumn>
                        <TableColumn>SỐ LƯỢNG YÊU CẦU</TableColumn>
                        <TableColumn>SỐ LƯỢNG THỰC TẾ</TableColumn>
                        <TableColumn>VỊ TRÍ</TableColumn>
                        <TableColumn>TRẠNG THÁI</TableColumn>
                        <TableColumn>THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item) => (
                            <TableRow key={item.itemId}>
                                <TableCell>
                                    <div>
                                        <p className="font-semibold">{item?.product?.productName}</p>
                                        <p className="text-sm text-gray-500">{item?.supplier?.supplierName}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip color="primary" variant="flat">
                                        {item.requestQuantity} {item?.unit?.unitName}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        size="sm"
                                        value={item.realityQuantity?.toString() || ""}
                                        onChange={(e) => onItemCheck(item.itemId, parseInt(e.target.value) || 0)}
                                        className="w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    {item.bin ? (
                                        <div className="text-sm">
                                            <p className="font-semibold">{item.bin.binCode}</p>
                                            <p className="text-gray-500">Capacity: {item.bin.capacity}</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Chưa chọn</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={
                                            getStatusFromBinAndQuantity(item) === 'imported' ? 'success' :
                                                getStatusFromBinAndQuantity(item) === 'checked' ? 'warning' : 'default'
                                        }
                                        variant="flat"
                                        size="sm"
                                    >
                                        {getStatusFromBinAndQuantity(item) === 'imported' ? 'Đã nhập' :
                                            getStatusFromBinAndQuantity(item) === 'checked' ? 'Đã kiểm tra' : 'Chờ kiểm tra'}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                        isDisabled={getStatusFromBinAndQuantity(item) !== 'checked'}
                                        onClick={() => onSelectLocation(item)}
                                        startContent={<Icon icon="mdi:map-marker" />}
                                    >
                                        Chọn vị trí
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Divider className="my-4" />

                <div className="flex justify-end">
                    <Button
                        color="success"
                        size="lg"
                        isLoading={loading}
                        onClick={onCompleteImport}
                        isDisabled={items.some(item => getStatusFromBinAndQuantity(item) !== 'imported')}
                        startContent={<Icon icon="mdi:check-circle" />}
                    >
                        Hoàn Thành Nhập Hàng
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
