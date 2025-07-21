import React, { useEffect, useState } from "react";
import { Select, SelectItem, Chip } from "@heroui/react";
import { Building2 } from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {GetAllWarehouseList, MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {StackCreate} from "@/Store/StackSlice.tsx";
import { Warehouse } from "@/types";
import {warehouseListSelector} from "@/Store/Selector.tsx";

interface Props {
    formData: StackCreate;
    setFormData: (key: string, value: string | number) => void,
}

const SelectWarehouse = ({ formData, setFormData }: Props) => {
    const defaultWarehouse: Warehouse[] = useSelector(warehouseListSelector);
    const dispatch = useDispatch();
    // Gọi API lấy danh sách kho
    useEffect(() => {
        const fetch = async () => {
            const page: pageApi = { pageNumber: 0, pageSize: 10 };
            await (dispatch as any)(MiddleGetWarehouseByUser(page));
        };
        fetch();
    }, [dispatch]);
    useEffect(() => {
        setFormData("warehouse",defaultWarehouse[0]?.warehouseId)
    }, [defaultWarehouse]);
    // Xử lý khi user chọn kho khác
    const handleSelectionChange = (keys: any) => {
        const selectedId = Array.from(keys)[0]?.toString();
        if (selectedId) {
            setFormData("warehouse",selectedId);
        }
    };

    return (
        <Select
            color={"primary"}
            label="Kho hàng"
            placeholder="Chọn kho"
            selectedKeys={formData.warehouse ? [formData.warehouse] : []}
            onSelectionChange={handleSelectionChange}
        >
            {defaultWarehouse?.map((warehouse) => (
                <SelectItem
                    key={warehouse.warehouseId}
                    value={warehouse.warehouseId}
                    textValue={warehouse.warehouseName}
                >
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>{warehouse.warehouseName}</span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
};

export default SelectWarehouse;