import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
     Chip, Button,
} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useImportOrderStore} from "@/zustand/importOrderStore.tsx";



export default function TableUI() {
    const columns=[
        {
            key:"product",label:"Product"
        },{
            key:"supplier",label:"Supplier"
        },{
            key:"quality",label:"Quality"
        },{
            key:"price",label:"Price"
        },{
            key:"totalPrice",label:"ToTal Price"
        },{
            key:"status",label:"Status"
        }
    ]
    const {items,removeItemByIndex} =useImportOrderStore();
    return (
        <Table>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody>
                {items.map((item,index) => (
                    <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.supplierName}</TableCell>
                        <TableCell><Chip size="sm" variant="flat">{item.requestQuantity} {item.unitName}</Chip></TableCell>
                        <TableCell>{item.costUnitBase.toLocaleString('vi-VN')} ₫</TableCell>
                        <TableCell><span className="font-semibold">{(item.requestQuantity * item.costUnitBase).toLocaleString('vi-VN')} ₫</span></TableCell>
                        <TableCell>
                            <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeItemByIndex(index)}>
                                <Icon icon="mdi:delete" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

