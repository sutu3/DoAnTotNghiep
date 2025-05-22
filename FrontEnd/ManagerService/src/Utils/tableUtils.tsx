import { StatusOptions } from "@/Data/Product/Data.tsx";

interface Item {
  [key: string]: any;
  name: string;
  status: string;
}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export function filterItems(
  items: Item[],
  filterValue: string,
  statusFilter: Set<string> | "all",
  hasSearchFilter: boolean,
): Item[] {
  let filtered = [...items];

  if (hasSearchFilter) {
    filtered = filtered.filter((user) =>
      user.name.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }

  if (
    statusFilter !== "all" &&
    Array.from(statusFilter).length !== StatusOptions.length
  ) {
    filtered = filtered.filter((user) =>
      Array.from(statusFilter).includes(user.status),
    );
  }

  return filtered;
}

/**
 * Lấy trang con theo page và rowsPerPage
 */
export function paginateItems(
  items: Item[],
  page: number,
  rowsPerPage: number,
): Item[] {
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  return items.slice(start, end);
}

/**
 * Sắp xếp item theo sortDescriptor
 */
export function sortItems(
  items: Item[],
  sortDescriptor: SortDescriptor,
): Item[] {
  return [...items].sort((a, b) => {
    const first = a[sortDescriptor.column];
    const second = b[sortDescriptor.column];
    const cmp = first < second ? -1 : first > second ? 1 : 0;

    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
}
