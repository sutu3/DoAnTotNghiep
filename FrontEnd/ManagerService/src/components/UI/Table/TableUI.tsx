import React, { useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    Chip,
    Tooltip,
    Progress, Spinner,
    Input
} from "@heroui/react";
import {
    Eye,
    Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { StacksSelector, TotalPageStack } from "@/Store/Selector.tsx";
import { MiddleGetAllStack } from "@/Store/Thunk/StackThunk.tsx";
import StackSlice, {StackCreate, StackType} from "@/Store/StackSlice.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import {useNavigate} from "react-router-dom";

interface StackTableProps {
    data:StackCreate,
    onStackSelect: (stackId: string) => void;
    onAddNew: () => void;
    selectedStackId?: string;
}

const columns = [
    { name: "Stack Name", uid: "stackName", sortable: true },
    { name: "Description", uid: "description", sortable: false },
    { name: "Warehouse", uid: "warehouse", sortable: true },
    { name: "Bin Status", uid: "binStatus", sortable: false },
    { name: "Created Date", uid: "createdAt", sortable: true },
    { name: "Actions", uid: "actions", sortable: false }
];

export const StackTable: React.FC<StackTableProps> = ({
    data,
                                                          onStackSelect,
                                                          selectedStackId
                                                      }) => {
    const dispatch = useDispatch();
    const stacks = useSelector(StacksSelector);
    const totalPages = useSelector(TotalPageStack);
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "stackName",
        direction: "ascending" as "ascending" | "descending"
    });

    // Fetch data when page changes
    
    useEffect(() => {
        setLoading(true);
        const fetch=async()=>{
            dispatch(StackSlice.actions.setStackList([]))
            const pageApi: pageApi = {
                pageNumber: page - 1,
                pageSize: 5
            };
            if(data.warehouse.length!=0){
                const stackName=filterValue==""?null:filterValue;
                await dispatch(MiddleGetAllStack(pageApi,data.warehouse,stackName) as any);
                setLoading(false)
            }
        }
        fetch()

    }, [page, dispatch,data?.warehouse,filterValue]);

    // Filter and sort data
    const filteredItems = useMemo(() => {
        let filtered = [...stacks];

        if (filterValue) {
            filtered = filtered.filter(stack =>
                stack.stackName.toLowerCase().includes(filterValue.toLowerCase()) ||
                stack.description?.toLowerCase().includes(filterValue.toLowerCase()) ||
                stack.warehouse?.warehouseName?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filtered;
    }, [stacks, filterValue]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof StackType];
            const second = b[sortDescriptor.column as keyof StackType];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredItems, sortDescriptor]);

    // Render cell content
    const renderCell = (stack: StackType, columnKey: string) => {
        switch (columnKey) {
            case "stackName":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-default-900">
                            {stack.stackName}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-500">
                            ID: {stack.stackId.slice(0, 8)}...
                        </p>
                    </div>
                );

            case "description":
                return (
                    <Tooltip content={stack.description}>
                        <p className="text-sm text-default-600 max-w-[200px] truncate">
                            {stack.description || "No description"}
                        </p>
                    </Tooltip>
                );

            case "warehouse":
                return (
                    <Chip
                        className="capitalize"
                        color="primary"
                        size="sm"
                        variant="flat"
                    >
                        {stack.warehouse?.warehouseName || "N/A"}
                    </Chip>
                );

            case "binStatus":
                const totalBins = stack.bin?.length || 0;
                const emptyBins = stack.bin?.filter(b => b.status === "EMPTY").length || 0;
                const fullBins = stack.bin?.filter(b => b.status === "FULL").length || 0;
                const maintenanceBins = stack.bin?.filter(b => b.status === "MAINTENANCE").length || 0;
                const usagePercent = totalBins > 0 ? Math.round(((totalBins - emptyBins) / totalBins) * 100) : 0;

                return (
                    <div className="flex flex-col gap-2 min-w-[120px]">
                        <div className="flex gap-1">
                            <Chip size="sm" color="success" variant="dot">
                                {emptyBins} Empty
                            </Chip>
                            <Chip size="sm" color="warning" variant="dot">
                                {fullBins} Full
                            </Chip>
                            {maintenanceBins > 0 && (
                                <Chip size="sm" color="danger" variant="dot">
                                    {maintenanceBins} Maintenance
                                </Chip>
                            )}
                        </div>
                        <Progress
                            size="sm"
                            value={usagePercent}
                            color={usagePercent > 80 ? "danger" : usagePercent > 50 ? "warning" : "success"}
                            className="max-w-md"
                        />
                        <p className="text-xs text-default-500">
                            {usagePercent}% utilized ({totalBins} total bins)
                        </p>
                    </div>
                );

            case "createdAt":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm">
                            {stack.createdAt
                                ? new Date(stack.createdAt).toLocaleDateString("vi-VN")
                                : "N/A"
                            }
                        </p>
                        <p className="text-xs text-default-500">
                            {stack.createdAt
                                ? new Date(stack.createdAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : ""
                            }
                        </p>
                    </div>
                );

            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="View details">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={()=>{
                                    navigate(`/admin/locations/stack?stackId=${stack.stackId}`)
                                }}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                    </div>
                );

            default:
                return <span>{stack[columnKey as keyof StackType] as string}</span>;
        }
    };

  //  Bottom content with pagination
    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                />
                <span className="w-[30%] text-small text-default-400">
          Showing {((page - 1) * 5) + 1} to {Math.min(page * 5, stacks.length)} of {stacks.length} entries
        </span>
            </div>
        );
    }, [page, totalPages, 5, stacks.length]);
    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Tìm kiếm theo tên stack"
                        startContent={<Search className="w-4 h-4" />}
                        value={filterValue}
                        onClear={() => setFilterValue("")}
                        onValueChange={setFilterValue}
                    />

                </div>
                <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Tổng {filteredItems.length} stack
                </span>
                </div>
            </div>
        );
    }, [filterValue, filteredItems.length]);
    return (
        <Table
            aria-label="Stack management table"
            isHeaderSticky
            topContent={topContent}
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[600px]",
            }}
            selectedKeys={selectedStackId ? [selectedStackId] : []}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
             //topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                if (selectedKey) {
                    onStackSelect(selectedKey);
                }
            }}
            onSortChange={(descriptor) => {
                setSortDescriptor({
                    column: descriptor.column as string,
                    direction: descriptor.direction as "ascending" | "descending"
                });
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                isLoading={loading}
                loadingContent={<Spinner label="Loading..." />}
                emptyContent="No stacks found"
                items={sortedItems}
            >
                {(item) => (
                    <TableRow
                        key={item.stackId}
                        className="hover:bg-default-100 cursor-pointer"
                    >
                        {(columnKey) => (
                            <TableCell>
                                {renderCell(item, columnKey as string)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default StackTable;