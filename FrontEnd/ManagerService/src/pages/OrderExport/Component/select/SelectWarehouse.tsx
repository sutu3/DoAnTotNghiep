import { Select, SelectItem } from "@heroui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {warehouseListSelector} from "@/Store/Selector.tsx";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface SelectWarehouseProps {
    formData: OrderRequestExportCreate;
    setFormData: (formData: (prev: any) => any) => void;
}

export default function SelectWarehouse({ formData, setFormData }: SelectWarehouseProps) {
    const dispatch = useDispatch();
    const warehouses = useSelector(warehouseListSelector);

    useEffect(() => {
        (dispatch as any)(MiddleGetWarehouseByUser({pageSize:0,pageNumber:10}));
    }, [dispatch]);

    return (
        <Select
            label="Kho xuất hàng"
            placeholder="Chọn kho xuất hàng"
            selectedKeys={formData.warehouse ? [formData.warehouse] : []}
            onSelectionChange={(keys) => {
                const warehouseId = Array.from(keys)[0]?.toString();
                setFormData(prev => ({
                    ...prev,
                    warehouse: warehouseId,
                }));
            }}
        >
            {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse.warehouseId}>
                    {warehouse.warehouseName}
                </SelectItem>
            ))}
        </Select>
    );
}