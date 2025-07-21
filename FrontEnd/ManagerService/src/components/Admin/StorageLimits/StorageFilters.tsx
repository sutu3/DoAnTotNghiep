import React from 'react';
import { Select, SelectItem, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

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

    const warehouseOptions = [
        { key: "all", label: "Tất cả kho" },
        { key: "warehouse1", label: "Kho A" },
        { key: "warehouse2", label: "Kho B" },
        { key: "warehouse3", label: "Kho C" }
    ];

    return (
        <div className="flex gap-3 items-center">
            <Select
                size="sm"
                placeholder="Chọn thời gian"
                selectedKeys={[timeFilter]}
                onSelectionChange={(keys) => onTimeFilterChange(Array.from(keys)[0] as string)}
                className="w-40"
                startContent={<Icon icon="mdi:calendar" />}
            >
                {timeOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                        {option.label}
                    </SelectItem>
                ))}
            </Select>

            <Select
                size="sm"
                placeholder="Chọn kho"
                selectedKeys={[warehouseFilter]}
                onSelectionChange={(keys) => onWarehouseFilterChange(Array.from(keys)[0] as string)}
                className="w-40"
                startContent={<Icon icon="mdi:warehouse" />}
            >
                {warehouseOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                        {option.label}
                    </SelectItem>
                ))}
            </Select>

            <Button
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