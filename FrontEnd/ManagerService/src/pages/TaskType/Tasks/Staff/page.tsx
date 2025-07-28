"use client";

import { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
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
    SelectItem,
    Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { callApiThunk } from "@/Store/Store.tsx";
import { API_ROUTES } from "@/Api/UrlApi.tsx";
import {MiddleGetAllTaskUserByUserId} from "@/Store/Thunk/TaskUserThunk.tsx";
import {TaskUserSelector} from "@/Store/Selector.tsx";

interface TaskUser {
    id: string;
    status: "Pending" | "In_Progress" | "Complete" | "Cancel";
    note: string;
    completeAt: string;
    createdAt: string;
    updatedAt: string;
    task: {
        taskId: string;
        taskType: {
            taskName: string;
        };
        description: string;
        level: "Low" | "Medium" | "High";
        warehouses: {
            warehouseId: string;
            warehouseName: string;
        };
    };
}

export default function MyTasksPage() {
    const TaskUser=useSelector(TaskUserSelector);
    const [taskUsers, setTaskUsers] = useState<TaskUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0
    });
    const dispatch = useDispatch();

    // Lấy userId từ localStorage hoặc auth context

    useEffect(() => {
        loadUserTasks();
    }, []);
    useEffect(() => {
        if(TaskUser){
            setTaskUsers(TaskUser);
            calculateStats(TaskUser);
        }
    }, [TaskUser]);
    const loadUserTasks = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllTaskUserByUserId({pageNumber:0,pageSize:10}));

        } catch (error) {
            console.error('Failed to load user tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (tasks: TaskUser[]) => {
        const stats = {
            pending: tasks.filter(t => t.status === "Pending").length,
            inProgress: tasks.filter(t => t.status === "In_Progress").length,
            completed: tasks.filter(t => t.status === "Complete").length,
            highPriority: tasks.filter(t => t.task.level === "High").length
        };
        setStats(stats);
    };

    const filteredTasks = taskUsers.filter(taskUser => {
        if (statusFilter === "all") return true;
        return taskUser.status === statusFilter;
    });

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

    const handleUpdateStatus = async (taskUserId: string, newStatus: string) => {
        try {
            // API call để update status TaskUser
            await callApiThunk(
                "PUT",
                `${API_ROUTES.user.taskUsers(null).base}/${taskUserId}/status`,
                { status: newStatus },
                (error: any) => error
            );

            // Reload tasks sau khi update
            await loadUserTasks();
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

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
                        { icon: "mdi:clock-outline", label: "Đang chờ", value: stats.pending, color: "text-warning" },
                        { icon: "mdi:progress-clock", label: "Đang thực hiện", value: stats.inProgress, color: "text-primary" },
                        { icon: "mdi:check-circle", label: "Hoàn thành", value: stats.completed, color: "text-success" },
                        { icon: "mdi:alert-circle", label: "Ưu tiên cao", value: stats.highPriority, color: "text-danger" },
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
                                <TableColumn>Ghi chú</TableColumn>
                                <TableColumn>Thao tác</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Không có nhiệm vụ nào">
                                {filteredTasks.map((taskUser) => (
                                    <TableRow key={taskUser.id}>
                                        <TableCell>{taskUser.task.taskType.taskName}</TableCell>
                                        <TableCell>{taskUser.task.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={levelColorMap[taskUser.task.level]}
                                                variant="flat"
                                            >
                                                {taskUser.task.level}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={statusColorMap[taskUser.status]}
                                                variant="flat"
                                            >
                                                {taskUser.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {taskUser.completeAt ? new Date(taskUser.completeAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">{taskUser.note}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" color="primary" variant="light">
                                                    <Icon icon="mdi:eye" />
                                                </Button>
                                                {taskUser.status === "Pending" && (
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        variant="light"
                                                        onClick={() => handleUpdateStatus(taskUser.id, "In_Progress")}
                                                    >
                                                        <Icon icon="mdi:play" />
                                                    </Button>
                                                )}
                                                {taskUser.status === "In_Progress" && (
                                                    <Button
                                                        size="sm"
                                                        color="warning"
                                                        variant="light"
                                                        onClick={() => handleUpdateStatus(taskUser.id, "Complete")}
                                                    >
                                                        <Icon icon="mdi:check" />
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