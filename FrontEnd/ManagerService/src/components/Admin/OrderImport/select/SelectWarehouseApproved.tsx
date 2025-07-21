import { Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { warehouseListSelector } from "@/Store/Selector.tsx";
import  { useEffect } from "react";
import { Warehouse } from "@/Store/WarehouseSlice.tsx";
import { MiddleGetWarehouseByUser } from "@/Store/Thunk/WarehouseThunk.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import { Building2 } from "lucide-react";

interface SelectProps {
    warehouse: string;
    setWarehouse: (value: string) => void;
}

const SelectWarehouseApprove = ({ warehouse, setWarehouse }: SelectProps) => {
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

    // Gán kho mặc định sau khi fetch xong
    useEffect(() => {
        if (defaultWarehouse.length > 0 && !warehouse) {
            setWarehouse(defaultWarehouse[0].warehouseId);
        }
    }, [defaultWarehouse, warehouse, setWarehouse]);

    // Xử lý khi user chọn kho khác
    const handleSelectionChange = (keys: any) => {
        const selectedId = Array.from(keys)[0]?.toString();
        if (selectedId) {
            setWarehouse( selectedId);
        }
    };

    return (
        <Select
            label="Kho hàng"
            placeholder="Chọn kho"
            selectedKeys={warehouse ? [warehouse] : []}
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

export default SelectWarehouseApprove;
