import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

import RenderCell from "@/components/UI/Table/RenderTable.tsx";
import BottomContent from "@/components/UI/Table/BottomContent.tsx";
import TopContent from "@/components/UI/Table/TopContent.tsx";
import { TableClassNames } from "@/components/UI/Table/TableCss.tsx";
import { User } from "@/types";
import { StackType } from "@/Store/StackSlice.tsx";

interface DataObject {
  id: number | string;
  [key: string]: any;
}

interface Column {
  uid: keyof DataObject | "actions";
  name: string;
  sortable?: boolean;
}

interface TableProductProps {
  isDarkMode: boolean;
  visibleColumn: string[];
  objects: DataObject[] | User[] | StackType[];
  columns: Column[];
  onGetId: (item: string) => void;
  getId: (item: DataObject | User | StackType) => string;
  onchange?: (data: any) => void;
  pageNumber: number;
  pageSize: number;
  totalPage: number;

  onPageChange: (page: number) => void;
}

const TableUI: React.FC<TableProductProps> = ({
  isDarkMode,
  objects,
  columns,
  onGetId,
  visibleColumn,
  getId,
  totalPage,
  pageNumber,
  onPageChange,
  onchange,
}) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number | string>>(
    new Set(),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(visibleColumn),
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  // const [rowsPerPage, setRowsPerPage] = React.useState(pageSize);
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });

  // console.log(totalPage);
  const pages = totalPage;
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) =>
      visibleColumns.has(column.uid.toString()),
    );
  }, [visibleColumns, columns]);

  const tableClassNames = TableClassNames({ isDarkMode });

  const onRowsPerPageChange = React.useCallback(
    (_e: React.ChangeEvent<HTMLSelectElement>) => {
      // setRowsPerPage(Number(e.target.value)); // Currently not used
      onPageChange(1);
    },
    [onPageChange],
  );

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    onPageChange(1);
  }, []);

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Custom table with cells, pagination and sorting"
      bottomContent={
        <BottomContent
          hasSearchFilter={hasSearchFilter}
          itemsLength={0}
          page={pageNumber}
          pages={pages}
          selectedKeys={selectedKeys}
          setPage={(p) => onPageChange(p)}
        />
      }
      bottomContentPlacement="outside"
      classNames={tableClassNames}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          columns={columns}
          filterValue={filterValue}
          hasSearchFilter={hasSearchFilter}
          onchange={onchange}
          setFilterValue={setFilterValue}
          setStatusFilter={setStatusFilter}
          setVisibleColumns={setVisibleColumns}
          statusFilter={statusFilter}
          usersLength={objects.length}
          visibleColumns={visibleColumns}
          onRowsPerPageChange={onRowsPerPageChange}
          onSearchChange={onSearchChange}
        />
      }
      topContentPlacement="outside"
      onRowAction={(key) => onGetId(String(key))}
      onSelectionChange={(keys) => {
        setSelectedKeys(new Set(Array.from(keys as Set<string | number>)));
      }}
      onSortChange={(descriptor) => {
        setSortDescriptor({
          column: String(descriptor.column),
          direction: descriptor.direction as "ascending" | "descending",
        });
      }}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid.toString()}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={!!column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No data found" items={objects}>
        {(item) => {
          return (
            <TableRow key={getId(item)}>
              {(columnKey) => (
                <TableCell onClick={() => onGetId(getId(item))}>
                  {RenderCell(item, columnKey.toString())}
                </TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};

export default TableUI;
