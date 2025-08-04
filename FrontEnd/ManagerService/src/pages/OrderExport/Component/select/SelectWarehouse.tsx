import {Select, SelectItem} from "@heroui/react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {warehouseListSelector} from "@/Store/Selector.tsx";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface SelectWarehouseProps {
    formData: OrderRequestExportCreate;
    handleOnChange: (value: string) => void;
}

export default function SelectWarehouse({ formData, handleOnChange }: SelectWarehouseProps) {
    const dispatch = useDispatch();
    const warehouses = useSelector(warehouseListSelector);

    useEffect(() => {
        const fetch = async () => {
            await (dispatch as any)(MiddleGetWarehouseByUser({pageSize: 0, pageNumber: 10}));
        }
        fetch();
    }, [dispatch]);

    return (
        <Select
            aria-labelledby="Input"
            label="Kho xuất hàng"
            placeholder="Chọn kho xuất hàng"
            selectedKeys={formData.warehouse ? [formData.warehouse] : []}
            onSelectionChange={(keys) => {
                const warehouseId = Array.from(keys)[0]?.toString();
                handleOnChange(warehouseId);
            }}
        >
            {warehouses.map((warehouse: any) => (
                <SelectItem aria-labelledby="Input"
                            key={warehouse.warehouseId}>
                    {warehouse.warehouseName}
                </SelectItem>
            ))}
        </Select>
    );
}