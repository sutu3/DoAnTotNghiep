import {Select, SelectItem} from "@heroui/react";
import {OrderRequestImportCreate} from "@/Store/ImportOrder.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import {useEffect} from "react";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

interface SelectProps {
    formData: OrderRequestImportCreate;
    setFormData: (formData: (prev: any) => any) => void;
}

const SelectWarehouse = ({formData, setFormData}: SelectProps) => {
    const defaultWarehouse:Warehouse = useSelector(warehouseSelector);


    // Set mặc định warehouse vào formData khi component mount hoặc warehouse thay đổi
    useEffect(() => {
        if (defaultWarehouse && !formData.warehouse) {
            setFormData((prev: any) => ({...prev, warehouse: defaultWarehouse?.warehouseId}));
        }
    }, [defaultWarehouse, formData.warehouse, setFormData]);

    return (
        <Select
            label="Kho hàng"
            placeholder="Chọn kho"
            selectedKeys={formData.warehouse ? [formData.warehouse] : []}
            isDisabled // Khóa dropdown - không cho chọn
        >
            {defaultWarehouse && (
                <SelectItem key={defaultWarehouse.warehouseId}>
                    {defaultWarehouse.warehouseName}
                </SelectItem>
            )}
        </Select>
    );
};

export default SelectWarehouse;
