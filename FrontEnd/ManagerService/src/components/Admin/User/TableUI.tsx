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
    Pagination, Spinner,
} from "@heroui/react";
import {UserData} from "@/Store/UserSlice.tsx";

interface UserTableProps {
    loading:boolean
    users: UserData[];
    onUserSelect: (userId: string) => void;
    selectedUserId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({loading,
                                                 users,
                                                 onUserSelect,
                                                 selectedUserId,
                                                 totalPage,
                                                 currentPage,
                                                 onPageChange
                                             }) => {

    const roles = [
        { key: "MANAGER", label: "Quản lý", color: "primary" },
        { key: "STAFF", label: "Nhân viên", color: "success" },
    ];

    const columns = [
        { key: "userName", label: "Nhân viên" },
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "Số điện thoại" },
        { key: "role", label: "Vai trò" },
        { key: "warehouseName", label: "Kho làm việc" },
        { key: "status", label: "Trạng thái" },
    ];
    const handleClick = (userId: string) => {
        onUserSelect(userId);
        // Bỏ setEditingRole khỏi đây
    }

    const getRoleColor = (roleName: string) => {
        const role = roles.find(r => r.key === roleName);
        return role?.color || "default";
    };

    const getRoleLabel = (roleName: string) => {
        const role = roles.find(r => r.key === roleName);
        return role?.label || roleName;
    };

    const renderCell = (user: any, columnKey: string) => {
        switch (columnKey) {
            case "userName":
                return (
                    <User
                        aria-labelledby="Input"
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
            case "role":
                const primaryRole = user.roles?.[0];
                const currentRoleName = primaryRole?.roleName || "N/A";
                    return (
                        <Chip
                            size="sm"
                            color={getRoleColor(currentRoleName)}
                            variant="flat"
                            className="capitalize cursor-pointer"
                        >
                            {getRoleLabel(currentRoleName)}
                        </Chip>                      );


                // Hiển thị role bình thường

            case "status":
                return (
                    <Chip                        aria-labelledby="Input"
                                                 className="capitalize"
                        color={user.status === "Active" ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                    >
                        {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
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
                aria-labelledby="Input"
                aria-label="User table"
                selectionMode="single"
                classNames={{
                    wrapper: "shadow-none rounded-lg",
                    th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                    td: "border-b border-gray-100 dark:border-gray-700 py-3"
                }}
            >
                <TableHeader                        aria-labelledby="Input"
                                                    columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner label="Loading..." />}
                    aria-labelledby="Input"
                    items={users} emptyContent="Không có dữ liệu">
                    {(user) => (
                        <TableRow                        aria-labelledby="Input"

                                                         key={user.userId}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedUserId === user.userId ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                            }`}
                            onClick={() => handleClick(user.userId)}
                        >
                            {(columnKey) => (
                                <TableCell                        aria-labelledby="Input"
                                >
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
                    <Pagination                        aria-labelledby="Input"

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