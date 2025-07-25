import React, {useMemo, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Progress,
    Chip,
    Spinner,
    Dropdown,
    Button,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Input,
    Pagination,
    Table,
    TableColumn,
    TableHeader,
    TableBody, TableRow, TableCell
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { StackCapacityDetailResponse } from '@/Hooks/useStorageStats';

interface StackCapacityTableProps {
    stackData?: StackCapacityDetailResponse[];
    loading?: boolean;
}

const StackCapacityTable: React.FC<StackCapacityTableProps> = ({
                                                                   stackData = [],
                                                                   loading
                                                               }) => {
    const [filterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // if (loading) {
    //     return (
    //         <Card>
    //             <CardHeader className="pb-3">
    //                 <div className="flex items-center gap-3">
    //                     <Icon icon="mdi:table" className="text-2xl text-purple-600" />
    //                     <div>
    //                         <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
    //                             Chi Tiết Sức Chứa Stack
    //                         </h3>
    //                         <p className="text-sm text-gray-600 dark:text-gray-400">
    //                             Đang tải dữ liệu...
    //                         </p>
    //                     </div>
    //                 </div>
    //             </CardHeader>
    //             <CardBody>
    //                 <div className="flex justify-center py-8">
    //                     <Spinner size="lg" />
    //                 </div>
    //             </CardBody>
    //         </Card>
    //     );
    // }

    // Sử dụng trực tiếp stackData từ API thay vì tính toán
    const processedStacks = useMemo(() => {
        return stackData?.map(stack => ({
            ...stack,
            // Tính toán fullBins từ totalBins - emptyBins - maintenanceBins
            fullBins: stack.totalBins - stack.emptyBins - stack.maintenanceBins,
            percentage: Math.round(stack.utilizationPercentage),
            warehouseName: "N/A" // API chưa trả về warehouse name, có thể cần thêm
        }));
    }, [stackData]);

    const filteredItems = useMemo(() => {
        let filtered = [...processedStacks];

        if (filterValue) {
            filtered = filtered?.filter((stack) =>
                (stack.stackName || '').toLowerCase().includes(filterValue.toLowerCase()) ||
                (stack.description || '').toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filtered;
    }, [processedStacks, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = (stack: StackCapacityDetailResponse & { fullBins: number; percentage: number; warehouseName: string }, columnKey: string) => {
        switch (columnKey) {
            case "stackInfo":
                return (
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {stack.stackName || `Stack ${stack.stackId}`}
                        </p>
                        <p className="text-sm text-gray-500">{stack.description || "Không có mô tả"}</p>
                    </div>
                );
            case "capacity":
                return (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{stack.occupiedBins}/{stack.totalBins}</span>
                            <span className="font-semibold">{stack.percentage}%</span>
                        </div>
                        <Progress
                            value={stack.percentage}
                            color={
                                stack.status === 'critical' ? 'danger' :
                                    stack.status === 'warning' ? 'warning' : 'success'
                            }
                            size="sm"
                        />
                    </div>
                );
            case "binStatus":
                return (
                    <div className="flex flex-wrap gap-1">
                        <Chip size="sm" color="success" variant="flat">
                            Trống: {stack.emptyBins}
                        </Chip>
                        <Chip size="sm" color="warning" variant="flat">
                            Đầy: {stack.fullBins}
                        </Chip>
                        <Chip size="sm" color="danger" variant="flat">
                            Bảo trì: {stack.maintenanceBins}
                        </Chip>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        size="sm"
                        color={
                            stack.status === 'critical' ? 'danger' :
                                stack.status === 'warning' ? 'warning' : 'success'
                        }
                        variant="flat"
                    >
                        {stack.status === 'critical' ? 'Gần đầy' :
                            stack.status === 'warning' ? 'Cảnh báo' : 'Bình thường'}
                    </Chip>
                );
            case "actions":
                return (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <Icon icon="mdi:dots-vertical" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem key="view">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:eye" />
                                    Xem chi tiết
                                </div>
                            </DropdownItem>
                            <DropdownItem key="optimize">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:cog" />
                                    Tối ưu hóa
                                </div>
                            </DropdownItem>
                            <DropdownItem key="report">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:file-chart" />
                                    Báo cáo
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return stack[columnKey as keyof typeof stack]?.toString() || '';
        }
    };

    const topContent = (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Tìm kiếm theo tên stack hoặc mô tả..."
                    startContent={<Icon icon="mdi:magnify" />}
                    value={filterValue}
                    onClear={() => setFilterValue("")}
                    onValueChange={setFilterValue}
                />
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={<Icon icon="mdi:download" />}
                        size="sm"
                    >
                        Xuất báo cáo
                    </Button>
                    <Button
                        color="secondary"
                        startContent={<Icon icon="mdi:refresh" />}
                        size="sm"
                        onClick={() => window.location.reload()}
                    >
                        Làm mới
                    </Button>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Tổng {filteredItems.length} stack
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Số dòng mỗi trang:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small ml-2"
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        value={rowsPerPage}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    );

    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Icon icon="mdi:table" className="text-2xl text-purple-600" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Chi Tiết Sức Chứa Stack
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Thông tin chi tiết về tình trạng từng stack
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <Table
                    aria-label="Bảng chi tiết sức chứa stack"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    topContent={topContent}
                    topContentPlacement="outside"
                >
                    <TableHeader>
                        <TableColumn key="stackInfo">STACK</TableColumn>
                        <TableColumn key="capacity">SỨC CHỨA</TableColumn>
                        <TableColumn key="binStatus">TRẠNG THÁI BIN</TableColumn>
                        <TableColumn key="status">TÌNH TRẠNG</TableColumn>
                        <TableColumn key="actions">THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody items={items} emptyContent="Không có dữ liệu">
                        {(item) => (
                            <TableRow key={item.stackId}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default StackCapacityTable;