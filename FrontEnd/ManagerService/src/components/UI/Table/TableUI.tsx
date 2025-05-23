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
import { filterItems, paginateItems, sortItems } from "@/Utils/tableUtils.tsx";
import {
  CheckboxPropsThemed,
  TableClassNames,
} from "@/components/UI/Table/TableCss.tsx";

// Định nghĩa interface cho object (row data)
interface DataObject {
  id: number | string;
  [key: string]: any;
}

// Định nghĩa interface cho column
interface Column {
  uid: string;
  name: string;
  sortable?: boolean;
}

interface TableProductProps {
  isDarkMode: boolean;
  visibleColumn: string[];
  objects: DataObject[];
  columns: Column[];
}

const TableUI: React.FC<TableProductProps> = ({
  isDarkMode,
  objects,
  columns,
  visibleColumn,
}) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number | string>>(
    new Set(),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(visibleColumn),
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(objects.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    return filterItems(objects, filterValue, statusFilter, hasSearchFilter);
  }, [objects, filterValue, statusFilter, hasSearchFilter]);

  const items = React.useMemo(() => {
    return paginateItems(filteredItems, page, rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return sortItems(items, sortDescriptor);
  }, [items, sortDescriptor]);

  const tableClassNames = <TableClassNames isDarkMode={isDarkMode} />;
  const checkboxPropsThemed = <CheckboxPropsThemed isDarkMode={isDarkMode} />;

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={
        <BottomContent
          hasSearchFilter={hasSearchFilter}
          itemsLength={items.length}
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
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={!!column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(object) => (
          <TableRow key={object.id}>
            {(columnKey) => (
              <TableCell>{RenderCell(object, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableUI;
