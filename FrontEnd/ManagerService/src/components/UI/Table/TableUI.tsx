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
import { filterItems, paginateItems, sortItems } from "@/Utils/TableUtils.tsx";
import {
  CheckboxPropsThemed,
  TableClassNames,
} from "@/components/UI/Table/TableCss.tsx";
import { User } from "@/types";

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
  objects: DataObject[] | User[];
  columns: Column[];
  getId: (item: DataObject|User) => string ;
  onchange?: (data: any) => void;
}

const TableUI: React.FC<TableProductProps> = ({
                                                isDarkMode,
                                                objects,
                                                columns,
                                                visibleColumn,
                                                getId,
                                                onchange,
                                              }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number | string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(new Set(visibleColumn));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(objects.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;
    return columns.filter((column) => visibleColumns.has(column.uid.toString()));
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    return filterItems(objects, filterValue, statusFilter, hasSearchFilter);
  }, [objects, filterValue, statusFilter, hasSearchFilter]);

  const paginatedItems = React.useMemo(() => {
    return paginateItems(filteredItems, page, rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return sortItems(paginatedItems, sortDescriptor);
  }, [paginatedItems, sortDescriptor]);
  const tableClassNames = TableClassNames({ isDarkMode });
  const checkboxPropsThemed = CheckboxPropsThemed({ isDarkMode });

  const onRowsPerPageChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
      },
      [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);
console.log(sortedItems)
  return (
      <Table
          isCompact
          removeWrapper
          aria-label="Custom table with cells, pagination and sorting"
          bottomContent={
            <BottomContent
                hasSearchFilter={hasSearchFilter}
                itemsLength={paginatedItems.length}
                page={page}
                pages={pages}
                selectedKeys={selectedKeys}
                setPage={setPage}
            />
          }
          bottomContentPlacement="outside"
          checkboxesProps={checkboxPropsThemed}
          classNames={tableClassNames}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={
            <TopContent
                onchange={onchange}
                columns={columns}
                filterValue={filterValue}
                hasSearchFilter={hasSearchFilter}
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
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
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
        <TableBody emptyContent="No data found" items={sortedItems}>
          {( item ) => {
            return (
                <TableRow key={getId(item)}>
                  {(columnKey) => (
                      <TableCell>{RenderCell(item, columnKey.toString())}</TableCell>
                  )}
                </TableRow>
            );
          }}
        </TableBody>


      </Table>
  );
};

export default TableUI;