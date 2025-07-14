import { Button, Chip, Input, TableCell, TableRow } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ImportItemRowProps {
    item: any;
    onItemCheck: (itemId: string, actualQuantity: number) => void;
    onSelectLocation: (item: any) => void;
}

export default function ImportItemRow({ item, onItemCheck, onSelectLocation }: ImportItemRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.supplierName}</p>
                </div>
            </TableCell>
            <TableCell>
                <Chip color="primary" variant="flat">
                    {item.requestQuantity} {item.unitName}
                </Chip>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    size="sm"
                    value={item.actualQuantity?.toString() || ""}
                    onChange={(e) => onItemCheck(item.itemId, parseInt(e.target.value) || 0)}
                    className="w-24"
                />
            </TableCell>
            <TableCell>
                {item.selectedStack && item.selectedBin ? (
                    <div className="text-sm">
                        <p className="font-semibold">{item.selectedStack}</p>
                        <p className="text-gray-500">{item.selectedBin}</p>
                    </div>
                ) : (
                    <span className="text-gray-400">Chưa chọn</span>
                )}
            </TableCell>
            <TableCell>
                <Chip
                    color={
                        item.status === 'imported' ? 'success' :
                            item.status === 'checked' ? 'warning' : 'default'
                    }
                    variant="flat"
                    size="sm"
                >
                    {item.status === 'imported' ? 'Đã nhập' :
                        item.status === 'checked' ? 'Đã kiểm tra' : 'Chờ kiểm tra'}
                </Chip>
            </TableCell>
            <TableCell>
                <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    isDisabled={item.status !== 'checked'}
                    onClick={() => onSelectLocation(item)}
                    startContent={<Icon icon="mdi:map-marker" />}
                >
                    Chọn vị trí
                </Button>
            </TableCell>
        </TableRow>
    );
}