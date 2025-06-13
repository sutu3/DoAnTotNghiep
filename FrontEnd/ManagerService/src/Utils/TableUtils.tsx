export function filterItems<T extends { [key: string]: any }>(
    items: T[],
    search: string,
    status: string,
    hasSearch: boolean
): T[] {
  return items.filter(item => {
    const matchSearch = !hasSearch || Object.values(item).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = status === "all" || item.status === status;
    return matchSearch && matchStatus;
  });
}

export function paginateItems<T>(items: T[], page: number, rowsPerPage: number): T[] {
  const start = (page - 1) * rowsPerPage;
  return items.slice(start, start + rowsPerPage);
}

export function sortItems<T>(items: T[], sortDescriptor: { column: string; direction: "ascending" | "descending" }): T[] {
  const { column, direction } = sortDescriptor;
  return [...items].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    if (aVal === bVal) return 0;
    const res = aVal > bVal ? 1 : -1;
    return direction === "ascending" ? res : -res;
  });
}