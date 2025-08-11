import { pageApi } from "@/Api/UrlApi";
import { MiddleGetWarehouseByUser } from "@/Store/Thunk/WarehouseThunk";
import { Warehouse } from "@/types";
import {Select, SelectItem} from "@heroui/react";
import { useEffect } from "react";
import {useDispatch, useSelector } from "react-redux";
import {Icon} from "@iconify/react";
import {warehouseListSelector} from "@/Store/Selector.tsx";


interface SelectWarehouseDeliveryFilterProps {
    warehouse: string;
    setWarehouse: (warehouseId: string) => void;
}

const SelectWarehouseDeliveryFilter = ({
                                           warehouse,
                                           setWarehouse,
                                       }: SelectWarehouseDeliveryFilterProps) => {
    const warehouses: Warehouse[] = useSelector(warehouseListSelector);
    const dispatch = useDispatch();

    // Fetch danh sách kho
    useEffect(() => {
        const fetchWarehouses = async () => {
            const page: pageApi = { pageNumber: 0, pageSize: 20 };
            await (dispatch as any)(MiddleGetWarehouseByUser(page));
        };
        fetchWarehouses();
    }, [dispatch]);

    // Set warehouse mặc định nếu chưa có
    useEffect(() => {
        if (warehouses?.length > 0 && !warehouse) {
            setWarehouse(warehouses[0].warehouseId); // Mặc định hiển thị tất cả
        }
    }, [warehouses, warehouse, setWarehouse]);

    const handleSelectionChange = (keys: any) => {
        const selectedId = Array.from(keys)[0]?.toString();
        if (selectedId) {
            setWarehouse(selectedId);
        }
    };

    return (
        <Select
            label="Lọc theo kho"
            placeholder="Chọn kho để lọc"
            selectedKeys={warehouse ? [warehouse] : []}
            onSelectionChange={handleSelectionChange}
            className={`w-full sm:max-w-[250px]`}
            size="sm"
            variant="bordered"
            startContent={<Icon icon="mdi:warehouse" className="text-orange-600" />}
        >
            {warehouses?.map((warehouse) => (
                <SelectItem
                    key={warehouse.warehouseId}
                    value={warehouse.warehouseId}
                    textValue={warehouse.warehouseName}
                >
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:warehouse" className="text-orange-600" />
                        <div className="flex flex-col">
                            <span className="font-medium">{warehouse.warehouseName}</span>
                            <span className="text-xs text-gray-500">
                                {warehouse.district}, {warehouse.country}
                            </span>
                        </div>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
};

export default SelectWarehouseDeliveryFilter;