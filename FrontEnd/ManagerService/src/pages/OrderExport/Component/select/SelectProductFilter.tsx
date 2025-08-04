import React, {useEffect} from 'react';
import {Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem} from '@heroui/react';
import {Building2, Filter, Package, RefreshCw, Search, Users} from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import {CategorySelector, SupplierSelector, UnitSelector} from '@/Store/Selector';
import {MiddleGetAllCategory} from "@/Store/Thunk/CategoryThunk.tsx";
import {MiddleGetAllSupplierList} from "@/Store/Thunk/ShupplierThunk.tsx";
import {MiddleGetAllUnitName} from "@/Store/Thunk/UnitThunk.tsx";
import {Category} from "@/Store/CategorySlice.tsx";
import {Unit} from "@/Store/Unit.tsx";

interface ProductFilterPanelProps {
    searchTerm: string;
    categoryFilter: string;
    unitFilter: string;
    supplierFilter: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onUnitChange: (value: string) => void;
    onSupplierChange: (value: string) => void;
    onClearFilters: () => void;
}

const ProductFilterPanel: React.FC<ProductFilterPanelProps> = ({
                                                                   searchTerm,
                                                                   categoryFilter,
                                                                   unitFilter,
                                                                   supplierFilter,
                                                                   onSearchChange,
                                                                   onCategoryChange,
                                                                   onUnitChange,
                                                                   onSupplierChange,
                                                                   onClearFilters
                                                               }) => {
    const categories = useSelector(CategorySelector);
    const suppliers = useSelector(SupplierSelector);
    const units: Unit[] = useSelector(UnitSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCatehory = async () => {
            await (dispatch as any)(MiddleGetAllCategory(null))
            await (dispatch as any)(MiddleGetAllSupplierList());
            await (dispatch as any)(MiddleGetAllUnitName());
        }
        fetchCatehory();
    }, [dispatch]);


    // Count active filters
    const activeFiltersCount = [
        searchTerm,
        categoryFilter !== "all" ? categoryFilter : null,
        unitFilter !== "all" ? unitFilter : null,
        supplierFilter !== "all" ? supplierFilter : null
    ].filter(Boolean).length;

    // Get category name by ID
    const getCategoryName = (id: string) => {
        const category = categories?.find((cat: any) => cat.categoryId === id);
        return category?.categoryName || id;
    };

    // Get supplier name by ID
    const getSupplierName = (id: string) => {
        const supplier = suppliers?.find((sup: any) => sup.supplierId === id);
        return supplier?.supplierName || id;
    };

    // Get unit name by key
    const getUnitName = (key: string) => {
        const unit = units.find(u => u.unitID === key);
        return unit?.unitName || key;
    };

    return (
        <div className="w-full space-y-4">
            {/* Header Section */}
            <Card
                className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Bộ lọc sản phẩm
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {activeFiltersCount > 0 ? `${activeFiltersCount} bộ lọc đang áp dụng` : 'Chưa có bộ lọc nào'}
                                </p>
                            </div>
                        </div>
                        <Button
                            aria-labelledby="Input"
                            size="sm"
                            variant="flat"
                            color="danger"
                            onClick={onClearFilters}
                            startContent={<RefreshCw className="w-4 h-4"/>}
                            isDisabled={activeFiltersCount === 0}
                            className="min-w-unit-20"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Filter Section */}
            <Card className="shadow-lg border-0">
                <CardBody className="p-6">
                    {/* Search Bar - Full Width */}
                    <div className="mb-6">
                        <Input
                            aria-labelledby="Input"
                            placeholder="Tìm kiếm sản phẩm theo tên, mã sản phẩm..."
                            value={searchTerm}
                            onValueChange={onSearchChange}
                            startContent={<Search className="w-5 h-5 text-gray-400"/>}
                            variant="bordered"
                            size="lg"
                            classNames={{
                                input: "text-sm",
                                inputWrapper: "h-12 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                            }}
                            isClearable
                        />
                    </div>

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-500"/>
                                Danh mục sản phẩm
                            </label>
                            <Select
                                placeholder="Chọn danh mục"
                                aria-labelledby="Input"
                                selectedKeys={categoryFilter ? [categoryFilter] : []}
                                onSelectionChange={(keys) => onCategoryChange(Array.from(keys)[0] as string)}
                                variant="bordered"
                                size="md"
                                classNames={{
                                    trigger: "h-11 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                }}
                            >
                                <SelectItem key="all" value="all">Tất cả danh mục</SelectItem>
                                {categories?.map((category: Category) => (
                                    <SelectItem aria-labelledby="Input"
                                                key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Unit Filter */}
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-green-500"/>
                                Đơn vị tính
                            </label>
                            <Select
                                placeholder="Chọn đơn vị"
                                aria-labelledby="Input"
                                selectedKeys={unitFilter ? [unitFilter] : []}
                                onSelectionChange={(keys) => onUnitChange(Array.from(keys)[0] as string)}
                                variant="bordered"
                                size="md"
                                classNames={{
                                    trigger: "h-11 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                }}
                            >
                                {units.map((unit: Unit) => (
                                    <SelectItem aria-labelledby="Input"
                                                key={unit.unitID} value={unit.unitID}>
                                        {unit.unitName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Supplier Filter */}
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-500"/>
                                Nhà cung cấp
                            </label>
                            <Select
                                aria-labelledby="Input"
                                placeholder="Chọn nhà cung cấp"
                                selectedKeys={supplierFilter ? [supplierFilter] : []}
                                onSelectionChange={(keys) => onSupplierChange(Array.from(keys)[0] as string)}
                                variant="bordered"
                                size="md"
                                classNames={{
                                    trigger: "h-11 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                }}
                            >
                                <SelectItem aria-labelledby="Input"
                                            key="all" value="all">Tất cả nhà cung cấp</SelectItem>
                                {suppliers?.map((supplier: any) => (
                                    <SelectItem aria-labelledby="Input"
                                                key={supplier.supplierId} value={supplier.supplierId}>
                                        {supplier.supplierName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {activeFiltersCount > 0 && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bộ lọc đang áp dụng:
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {searchTerm && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        onClose={() => onSearchChange("")}
                                        classNames={{
                                            base: "bg-blue-100 dark:bg-blue-900/30",
                                            content: "text-blue-700 dark:text-blue-300 font-medium"
                                        }}
                                    >
                                        Tìm:
                                        "{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"
                                    </Chip>
                                )}
                                {categoryFilter && categoryFilter !== "all" && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="success"
                                        onClose={() => onCategoryChange("all")}
                                        classNames={{
                                            base: "bg-green-100 dark:bg-green-900/30",
                                            content: "text-green-700 dark:text-green-300 font-medium"
                                        }}
                                    >
                                        Danh mục: {getCategoryName(categoryFilter)}
                                    </Chip>
                                )}
                                {unitFilter && unitFilter !== "all" && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="warning"
                                        onClose={() => onUnitChange("all")}
                                        classNames={{
                                            base: "bg-orange-100 dark:bg-orange-900/30",
                                            content: "text-orange-700 dark:text-orange-300 font-medium"
                                        }}
                                    >
                                        Đơn vị: {getUnitName(unitFilter)}
                                    </Chip>
                                )}
                                {supplierFilter && supplierFilter !== "all" && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="secondary"
                                        onClose={() => onSupplierChange("all")}
                                        classNames={{
                                            base: "bg-purple-100 dark:bg-purple-900/30",
                                            content: "text-purple-700 dark:text-purple-300 font-medium"
                                        }}
                                    >
                                        NCC: {getSupplierName(supplierFilter)}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default ProductFilterPanel;