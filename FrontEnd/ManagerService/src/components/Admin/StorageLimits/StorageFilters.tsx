import React from 'react';
import { Select, SelectItem, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";

interface StorageFiltersProps {
    timeFilter: string;
    warehouseFilter: string;
    onTimeFilterChange: (value: string) => void;
    onWarehouseFilterChange: (value: string) => void;
}

const StorageFilters: React.FC<StorageFiltersProps> = ({
                                                           timeFilter,
                                                           warehouseFilter,
                                                           onTimeFilterChange,
                                                           onWarehouseFilterChange
                                                       }) => {
    const timeOptions = [
        { key: "today", label: "Hôm nay" },
        { key: "week", label: "Tuần này" },
        { key: "month", label: "Tháng này" },
        { key: "quarter", label: "Quý này" }
    ];

    return (
        <div className="flex gap-3 items-center">
            <Select
                aria-labelledby="Input"
                size="sm"
                placeholder="Chọn thời gian"
                selectedKeys={[timeFilter]}
                onSelectionChange={(keys) => onTimeFilterChange(Array.from(keys)[0] as string)}
                className="w-40"
                startContent={<Icon icon="mdi:calendar" />}
            >
                {timeOptions.map((option) => (
                    <SelectItem aria-labelledby="Input" key={option.key} value={option.key}>
                        {option.label}
                    </SelectItem>
                ))}
            </Select>

            <SelectWarehouseApproved warehouse={warehouseFilter} setWarehouse={onWarehouseFilterChange}/>

            <Button
                aria-labelledby="Input"
                size="sm"
                variant="bordered"
                startContent={<Icon icon="mdi:filter" />}
            >
                Lọc nâng cao
            </Button>
        </div>
    );
};

export default StorageFilters;