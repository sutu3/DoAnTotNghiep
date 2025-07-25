import React from 'react';
import { Input, Select, SelectItem, Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ProductSearchPanelProps {
    searchFilter: string;
    categoryFilter: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const ProductSearchPanel: React.FC<ProductSearchPanelProps> = ({
                                                                   searchFilter,
                                                                   categoryFilter,
                                                                   statusFilter,
                                                                   onSearchChange,
                                                                   onCategoryChange,
                                                                   onStatusChange
                                                               }) => {
    const categories = [
        { key: "all", label: "Tất cả danh mục" },
        { key: "electronics", label: "Điện tử" },
        { key: "clothing", label: "Thời trang" },
        { key: "food", label: "Thực phẩm" },
        { key: "books", label: "Sách" }
    ];

    const statuses = [
        { key: "all", label: "Tất cả trạng thái" },
        { key: "available", label: "Có sẵn" },
        { key: "low_stock", label: "Sắp hết" },
        { key: "out_of_stock", label: "Hết hàng" },
        { key: "expired", label: "Hết hạn" }
    ];

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:magnify" className="text-xl text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tìm kiếm & Lọc
                    </h3>
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchFilter}
                    onValueChange={onSearchChange}
                    startContent={<Icon icon="mdi:magnify" />}
                    variant="bordered"
                />

                <Select
                    label="Danh mục"
                    selectedKeys={[categoryFilter]}
                    onSelectionChange={(keys) => onCategoryChange(Array.from(keys)[0] as string)}
                    variant="bordered"
                >
                    {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                            {category.label}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Trạng thái"
                    selectedKeys={[statusFilter]}
                    onSelectionChange={(keys) => onStatusChange(Array.from(keys)[0] as string)}
                    variant="bordered"
                >
                    {statuses.map((status) => (
                        <SelectItem key={status.key} value={status.key}>
                            {status.label}
                        </SelectItem>
                    ))}
                </Select>
            </CardBody>
        </Card>
    );
};

export default ProductSearchPanel;