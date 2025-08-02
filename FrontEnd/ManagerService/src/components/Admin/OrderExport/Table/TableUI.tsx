import {
    Button,
    Card,
    CardBody,
    CardHeader, Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import ExportOrderSlice, {ExportItemCreateUI} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import { ExportItemCreateSelector } from "@/pages/ExecuteExport/Store/Selector";

const TableUI = () => {
    const items = useSelector(ExportItemCreateSelector)
    const dispatch = useDispatch();
    const handleRemoveItem=(index:number)=>{
        dispatch(ExportOrderSlice.actions.setRemoveItemOrderCreate(index));
    }
    return (
        <Card aria-labelledby="Input">
            <CardHeader aria-labelledby="Input">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Danh Sách Sản Phẩm Xuất ({items?.length})
                </h2>
            </CardHeader>
            <CardBody>
                <Table aria-labelledby="Input">
                    <TableHeader aria-labelledby="Input">
                        <TableColumn aria-labelledby="Input">Sản phẩm</TableColumn>
                        <TableColumn aria-labelledby="Input">Số lượng</TableColumn>
                        <TableColumn aria-labelledby="Input">Đơn giá</TableColumn>
                        <TableColumn aria-labelledby="Input">Thành tiền</TableColumn>
                        <TableColumn aria-labelledby="Input">Thao tác</TableColumn>
                    </TableHeader>
                    <TableBody aria-labelledby="Input">
                        {items?.map((item: ExportItemCreateUI, index: number ) => (
                                <TableRow  aria-labelledby="Input" key={index}>
                                    <TableCell  aria-labelledby="Input">{item.productName}</TableCell>
                                    <TableCell  aria-labelledby="Input">
                                        <Chip size="sm" variant="flat">
                                            {item.requestQuantity} {item.unitName}
                                        </Chip>
                                    </TableCell>
                                    <TableCell  aria-labelledby="Input">
                                        {item.unitPrice.toLocaleString('vi-VN')} ₫
                                    </TableCell>
                                    <TableCell  aria-labelledby="Input">
                                        <span className="font-semibold">
                                            {(item.requestQuantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </TableCell >
                                    <TableCell  aria-labelledby="Input">
                                        <Button
                                            aria-labelledby="Input"
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            <Icon icon="mdi:delete" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>


    )
}
export default TableUI;