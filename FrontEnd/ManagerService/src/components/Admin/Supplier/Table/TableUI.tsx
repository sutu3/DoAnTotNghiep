import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination, Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import {ChevronDownIcon, PlusIcon, SearchIcon} from "lucide-react";
import {useSelector} from "react-redux";
import {SupplierSelector, TotalPageSelector} from "@/Store/Selector.tsx";
import {columns, Supplier} from "@/Store/SupplierSlice.tsx";
import RenderTable, {Props} from "@/components/Admin/Supplier/Table/RenderTable.tsx";
import {useNavigate} from "react-router-dom";
import  {useCallback, useMemo, useState} from "react";


export const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "Paused", uid: "paused"},
    {name: "Vacation", uid: "vacation"},
];

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}


const INITIAL_VISIBLE_COLUMNS = [
    "supplierName",
    "email",
    "phoneNumber",
    "address",
    "status",
    "createdAt","action"
];
interface Pros{
    loading: boolean;
    setOpen: (open: boolean) => void;
    open: boolean;
}
const TableUI=({loading,setOpen,open}:Pros)=> {
    const object = useSelector(SupplierSelector);
    const navigate = useNavigate(); // ✅ tạo hàm navigate từ hook
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const handleDetail=(supplierId:string) => {
        navigate(`/admin/supplier/edit?supplierId=${supplierId}`);
        console.log(supplierId);
        // Detail của supplier
    }
    const handleDelete=(supplierId:string) => {
        console.log(supplierId);

        // Delete của supplier
    }
    const pages =useSelector(TotalPageSelector);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        // @ts-ignore
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredobject = [...object];

        if (hasSearchFilter) {
            filteredobject = filteredobject.filter((object) =>
                object.supplierName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredobject = filteredobject.filter((object) =>
                Array.from(statusFilter).includes(object.status),
            );
        }

        return filteredobject;
    }, [object, filterValue, statusFilter]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    const onRowsPerPageChange = useCallback((e: { target: { value: any; }; }) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300"/>}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small"/>}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small"/>}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            onClick={() => navigate("/admin/suppliers/addnew")} // ✅ dùng navigate đúng cách
                                   aria-labelledby="Button" className="bg-foreground text-background" endContent={<PlusIcon/>} size="sm">
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {object.length} object</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        object.length,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
          {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${items.length} selected`}
        </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                "group-data-[first=true]/tr:first:before:rounded-none",
                "group-data-[first=true]/tr:last:before:rounded-none",
                "group-data-[middle=true]/tr:before:rounded-none",
                "group-data-[last=true]/tr:first:before:rounded-none",
                "group-data-[last=true]/tr:last:before:rounded-none",
            ],
        }),
        [],
    );

    return (
        <Table
            isCompact
            removeWrapper
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
                classNames: {
                    wrapper: "after:bg-foreground after:text-background text-background",
                },
            }}

            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
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
            <TableBody  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                        isLoading={loading}
                        loadingContent={<Spinner label="Loading..." />}
                         emptyContent={"No object found"} items={sortedItems}>
                {(item: Supplier) => (
                    <TableRow key={item.supplierId}>
                        {(columnKey) => <TableCell>
                            {RenderTable({
                               item,
                                setOpen,
                                open,
                                columnKey,
                                handleDetail,
                                handleDelete
                            } as Props)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
export default TableUI;
