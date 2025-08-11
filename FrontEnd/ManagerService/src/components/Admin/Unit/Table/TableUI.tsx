import React from "react";
import {
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import {columns, GroupUnit} from "@/Store/GroupUnit.tsx";
import {useSelector} from "react-redux";
import {GroupUnitSelector, TotalPageGroupUnit} from "@/Store/Selector.tsx";
import RenderTable, {Props} from "@/components/Admin/Unit/Table/RenderTable.tsx";
import {useNavigate} from "react-router-dom";

interface GroupUnitProg {
    loading: boolean;
}

const TableUI = ({loading}: GroupUnitProg) => {
    console.log("TableUI rendered with loading:", loading);
    const navigate = useNavigate();
    const object = useSelector(GroupUnitSelector);
    const pages = useSelector(TotalPageGroupUnit);
    const [page, setPage] = React.useState(1);
    const [rowsPerPage] = React.useState(5);

    const handleDetail = (name: string) => {
        navigate(`/admin/unitType?groupUnitName=${name}`);
    }

    // Chỉ giữ lại pagination logic
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return object.slice(start, end);
    }, [page, object, rowsPerPage]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [page, pages]);

    return (
        <div className="w-full">
            {/* Header đơn giản */}
            <div className="mb-4 flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Tổng {object.length} nhóm đơn vị
                </span>
            </div>

            <Table
                isCompact
                removeWrapper
                aria-label="Group Unit table"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: ["max-h-[500px]"],
                    th: ["bg-gray-50", "text-gray-700", "font-semibold"],
                    td: ["py-3", "border-b", "border-gray-100"]
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    isLoading={loading}
                    loadingContent={<Spinner label="Đang tải..."/>}
                    emptyContent={
                        <div className="text-center py-8">
                            <p className="text-gray-500">Không có dữ liệu</p>
                        </div>
                    }
                    items={items}
                >
                    {(item: GroupUnit) => (
                        <TableRow
                            key={item.groupUnitID}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            {(columnKey) => (
                                <TableCell>
                                    <RenderTable
                                        groupUnitID={item.groupUnitID}
                                        item={item}
                                        columnKey={columnKey}
                                        open={false}
                                        setEvent={() => {
                                        }}
                                        setOpen={() => {
                                        }}
                                        handleDetail={handleDetail}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default TableUI;