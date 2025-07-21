import React, { useEffect, useState } from "react";
import { Select, SelectItem, Chip } from "@heroui/react";
import { Building2 } from "lucide-react";
import {useDispatch} from "react-redux";
import { GetAllWarehouseList} from "@/Store/Thunk/WarehouseThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";

interface Warehouse {
    warehouseId: string;
    warehouseName: string;
}

interface Props {
    warehouseList: string[];
    setWarehouseList: (value: string[]) => void;
}

const WarehouseMultiSelect: React.FC<Props> = ({ warehouseList, setWarehouseList }) => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const page:pageApi={pageNumber:1,pageSize:0};
                const result=await (dispatch as any)(GetAllWarehouseList({page}))
                setWarehouses(result.payload.result);
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            }
        };
        fetchWarehouses();
    }, []);

    const handleSelectionChange = (keys: any) => {
        const selectedIds = Array.from(keys) as string[];
        setSelectedWarehouses(selectedIds);
        setWarehouseList(selectedIds);
        console.log(warehouseList)
    };

    const getSelectedWarehouseNames = () => {
        return warehouses
            .filter(wh => selectedWarehouses.includes(wh.warehouseId))
            .map(wh => wh.warehouseName);
    };

    return (
        <div className="space-y-3">
            <Select
                label="Kho hàng"
                placeholder="Chọn các kho để lưu trữ sản phẩm"
                selectionMode="multiple"
                selectedKeys={new Set(selectedWarehouses)}
                onSelectionChange={handleSelectionChange}
                startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                classNames={{
                    trigger: "min-h-12",
                    label: "text-gray-700 dark:text-gray-300",
                    value: "text-gray-800 dark:text-white"
                }}
                renderValue={(items) => (
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <Chip
                                key={item.key}
                                color="primary"
                                variant="flat"
                                size="sm"
                                className="text-xs"
                            >
                                {item.textValue}
                            </Chip>
                        ))}
                    </div>
                )}
            >
                {warehouses.map((warehouse) => (
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

            {/* Display selected warehouses count */}
            {selectedWarehouses.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Đã chọn {selectedWarehouses.length} kho: {getSelectedWarehouseNames().join(", ")}
                </div>
            )}
        </div>
    );
};

export default WarehouseMultiSelect;