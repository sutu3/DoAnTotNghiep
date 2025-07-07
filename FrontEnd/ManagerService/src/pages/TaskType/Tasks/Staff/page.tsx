"use client";

import { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Chip,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Select,
    SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Task {
    taskId: string;
    taskType: {
        taskName: string;
    };
    description: string;
    status: "Pending" | "In_Progress" | "Complete" | "Cancel";
    level: "Low" | "Medium" | "High";
    completeAt: string;
}

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            "taskId": "task-001-uuid-string",
            "taskType": {
                "taskTypeId": "task-type-001-uuid-string",
                "taskName": "Kiểm kê hàng hóa"
            },
            "status": "Pending",
            "level": "High",
            "description": "Kiểm tra số lượng và chất lượng hàng hóa trong kho A",
            "taskUsers": [
                {
                    "taskUserId": "task-user-001-uuid-string",
                    "userId": "user-002-uuid-string",
                    "status": "Assigned",
                    "note": "Nhiệm vụ ưu tiên cao"
                }
            ],
            "warehouses": {
                "warehouseId": "wh-001-uuid-string",
                "warehouseName": "Kho Trung Tâm Hà Nội"
            },
            "completeAt": "2024-01-25T17:00:00Z"
        },
        {
            "taskId": "task-002-uuid-string",
            "taskType": {
                "taskTypeId": "task-type-002-uuid-string",
                "taskName": "Sắp xếp hàng hóa"
            },
            "status": "In_Progress",
            "level": "Medium",
            "description": "Sắp xếp lại hàng hóa trong dãy Stack-B theo quy chuẩn mới",
            "taskUsers": [
                {
                    "taskUserId": "task-user-002-uuid-string",
                    "userId": "user-002-uuid-string",
                    "status": "In_Progress",
                    "note": "Đang thực hiện"
                }
            ],
            "warehouses": {
                "warehouseId": "wh-001-uuid-string",
                "warehouseName": "Kho Trung Tâm Hà Nội"
            },
            "completeAt": "2024-01-24T16:00:00Z"
        },
        {
            "taskId": "task-003-uuid-string",
            "taskType": {
                "taskTypeId": "task-type-003-uuid-string",
                "taskName": "Vệ sinh kho"
            },
            "status": "Complete",
            "level": "Low",
            "description": "Vệ sinh tổng thể khu vực kho và các bin chứa hàng",
            "taskUsers": [
                {
                    "taskUserId": "task-user-003-uuid-string",
                    "userId": "user-002-uuid-string",
                    "status": "Completed",
                    "note": "Hoàn thành đúng hạn"
                }
            ],
            "warehouses": {
                "warehouseId": "wh-001-uuid-string",
                "warehouseName": "Kho Trung Tâm Hà Nội"
            },
            "completeAt": "2024-01-20T15:30:00Z"
        },
        {
            "taskId": "task-004-uuid-string",
            "taskType": {
                "taskTypeId": "task-type-004-uuid-string",
                "taskName": "Kiểm tra thiết bị"
            },
            "status": "Pending",
            "level": "Medium",
            "description": "Kiểm tra và bảo trì các thiết bị xe nâng và scanner",
            "taskUsers": [
                {
                    "taskUserId": "task-user-004-uuid-string",
                    "userId": "user-002-uuid-string",
                    "status": "Assigned",
                    "note": "Cần hoàn thành trước cuối tuần"
                }
            ],
            "warehouses": {
                "warehouseId": "wh-001-uuid-string",
                "warehouseName": "Kho Trung Tâm Hà Nội"
            },
            "completeAt": "2024-01-26T18:00:00Z"
        },
        {
            "taskId": "task-005-uuid-string",
            "taskType": {
                "taskTypeId": "task-type-005-uuid-string",
                "taskName": "Cập nhật hệ thống"
            },
            "status": "Cancel",
            "level": "Low",
            "description": "Cập nhật thông tin sản phẩm trong hệ thống quản lý",
            "taskUsers": [
                {
                    "taskUserId": "task-user-005-uuid-string",
                    "userId": "user-002-uuid-string",
                    "status": "Cancelled",
                    "note": "Hủy do thay đổi yêu cầu"
                }
            ],
            "warehouses": {
                "warehouseId": "wh-001-uuid-string",
                "warehouseName": "Kho Trung Tâm Hà Nội"
            },
            "completeAt": "2024-01-23T12:00:00Z"
        }
    ]);
    const [statusFilter, setStatusFilter] = useState("all");

    const statusColorMap = {
        Pending: "warning",
        In_Progress: "primary",
        Complete: "success",
        Cancel: "danger"
    };

    const levelColorMap = {
        Low: "success",
        Medium: "warning",
        High: "danger"
    };

    const handleUpdateStatus = (taskId: string, newStatus: string) => {
        console.log(`Updating task ${taskId} to ${newStatus}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center items-center gap-3">
                        <Icon icon="mdi:clipboard-list" className="text-4xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Nhiệm Vụ Của Tôi
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Quản lý và theo dõi các nhiệm vụ được giao
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 mb-6 md:grid-cols-4 gap-4">
                    {[
                        { icon: "mdi:clock-outline", label: "Đang chờ", value: 5, color: "text-warning" },
                        { icon: "mdi:progress-clock", label: "Đang thực hiện", value: 3, color: "text-primary" },
                        { icon: "mdi:check-circle", label: "Hoàn thành", value: 12, color: "text-success" },
                        { icon: "mdi:alert-circle", label: "Ưu tiên cao", value: 2, color: "text-danger" },
                    ].map((stat, index) => (
                        <Card key={index} className="shadow-sm">
                            <CardBody className="text-center">
                                <Icon icon={stat.icon} className={`text-3xl mb-2 mx-auto ${stat.color}`} />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Tasks Table Section */}
                {/* Tasks Table */}
                <Card>
                    <CardHeader className="flex justify-between">
                        <h2 className="text-xl font-semibold">Danh Sách Nhiệm Vụ</h2>
                        <Select
                            size="sm"
                            placeholder="Lọc theo trạng thái"
                            className="w-48"
                            selectedKeys={statusFilter !== "all" ? [statusFilter] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0]?.toString();
                                setStatusFilter(selected || "all");
                            }}
                        >
                            <SelectItem key="all">Tất cả</SelectItem>
                            <SelectItem key="Pending">Đang chờ</SelectItem>
                            <SelectItem key="In_Progress">Đang thực hiện</SelectItem>
                            <SelectItem key="Complete">Hoàn thành</SelectItem>
                        </Select>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <TableHeader>
                                <TableColumn>Loại nhiệm vụ</TableColumn>
                                <TableColumn>Mô tả</TableColumn>
                                <TableColumn>Mức độ</TableColumn>
                                <TableColumn>Trạng thái</TableColumn>
                                <TableColumn>Hạn hoàn thành</TableColumn>
                                <TableColumn>Thao tác</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.taskId}>
                                        <TableCell>{task.taskType.taskName}</TableCell>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={levelColorMap[task.level]}
                                                variant="flat"
                                            >
                                                {task.level}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={statusColorMap[task.status]}
                                                variant="flat"
                                            >
                                                {task.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {task.completeAt ? new Date(task.completeAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" color="primary" variant="light">
                                                    <Icon icon="mdi:eye" />
                                                </Button>
                                                {task.status === "Pending" && (
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        variant="light"
                                                        onClick={() => handleUpdateStatus(task.taskId, "In_Progress")}
                                                    >
                                                        <Icon icon="mdi:play" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

            </div>
        </div>
    );
}
