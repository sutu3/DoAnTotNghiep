import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    User,
    Pagination
} from "@heroui/react";

interface UserTableProps {
    users: any[];
    onUserSelect: (userId: string) => void;
    selectedUserId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
                                                 users,
                                                 onUserSelect,
                                                 selectedUserId,
                                                 totalPage,
                                                 currentPage,
                                                 onPageChange
                                             }) => {
    const columns = [
        { key: "userName", label: "Nhân viên" },
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "Số điện thoại" },
        { key: "warehouseName", label: "Kho làm việc" },
        { key: "status", label: "Trạng thái" }
    ];

    const renderCell = (user: any, columnKey: string) => {
        switch (columnKey) {
            case "userName":
                return (
                    <User
                        avatarProps={{
                            radius: "full",
                            size: "sm",
                            src: user.urlImage,
                            name: user.userName?.charAt(0).toUpperCase()
                        }}
                        description={user.fullName}
                        name={user.userName}
                    />
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={user.status === "Active" ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                    >
                        {user.status}
                    </Chip>
                );
            case "warehouseName":
                return (
                    <span className="text-blue-600 dark:text-blue-400">
            {user.warehouses?.warehouseName || "N/A"}
          </span>
                );
            case "email":
                return (
                    <span className="text-gray-600 dark:text-gray-300">
            {user.email || "N/A"}
          </span>
                );
            case "phoneNumber":
                return (
                    <span className="text-gray-600 dark:text-gray-300 font-mono">
            {user.phoneNumber || "N/A"}
          </span>
                );
            default:
                return user[columnKey] || "N/A";
        }
    };

    return (
        <div className="space-y-4">
            <Table
                aria-label="User table"
                selectionMode="single"
                classNames={{
                    wrapper: "shadow-none rounded-lg",
                    th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                    td: "border-b border-gray-100 dark:border-gray-700 py-3"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users} emptyContent="Không có dữ liệu">
                    {(user) => (
                        <TableRow
                            key={user.userId}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedUserId === user.userId ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                            }`}
                            onClick={() => onUserSelect(user.userId)}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(user, columnKey.toString())}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="flex justify-center py-4">
                    <Pagination
                        total={totalPage}
                        page={currentPage}
                        onChange={onPageChange}
                        showControls
                        classNames={{
                            cursor: "bg-green-600 text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserTable;