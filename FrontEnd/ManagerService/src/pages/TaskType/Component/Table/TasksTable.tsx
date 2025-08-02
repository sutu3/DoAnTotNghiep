import { TaskUser } from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@heroui/react";
import {
    AlertTriangle,
    CheckCircle,
    ClipboardList,
    Clock,
    Eye,
    List,
    MinusCircle,
    PlayCircle,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface TasksTableProps {
    taskUsers: TaskUser[];
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    onViewDetail: (taskUser: TaskUser) => void;
    onStartTask: (taskUser: TaskUser) => void;
    onCompleteTask: (taskUser: TaskUser) => void;
    onCancelTask: (taskUser: TaskUser) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
                                                   taskUsers,
                                                   statusFilter,
                                                   setStatusFilter,
                                                   onViewDetail,
                                                   onStartTask,
                                                   onCompleteTask,
                                                   onCancelTask
                                               }) => {
    const [item, setItem] = useState<TaskUser[]>([]);

    useEffect(() => {
        setItem(taskUsers);
    }, [taskUsers]);

    const statusColorMap = {
        Pending: "warning",
        In_Progress: "primary",
        Complete: "success",
        Cancel: "danger"
    } as const;

    const levelColorMap = {
        Low: "success",
        Medium: "warning",
        High: "danger"
    } as const;

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending': return 'Đang chờ';
            case 'In_Progress': return 'Đang thực hiện';
            case 'Complete': return 'Hoàn thành';
            case 'Cancel': return 'Đã hủy';
            default: return status;
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'Low': return 'Thấp';
            case 'Medium': return 'Trung bình';
            case 'High': return 'Cao';
            default: return level;
        }
    };

    return (
        <Card className="rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <List className="text-2xl text-gray-700" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Danh Sách Nhiệm Vụ</h2>
                            <p className="text-sm text-gray-600">{item.length} nhiệm vụ</p>
                        </div>
                    </div>
                    <Select
                        aria-labelledby="Input"
                        size="sm"
                        placeholder="Lọc theo trạng thái"
                        className="w-full md:w-56"
                        selectedKeys={statusFilter !== "all" ? [statusFilter] : []}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0]?.toString();
                            setStatusFilter(selected || "all");
                        }}
                        variant="bordered"
                    >
                        <SelectItem                 aria-labelledby="Input"
                                                    key="all">Tất cả trạng thái</SelectItem>
                        <SelectItem                 aria-labelledby="Input"
                                                    key="Pending">Đang chờ</SelectItem>
                        <SelectItem                 aria-labelledby="Input"
                                                    key="In_Progress">Đang thực hiện</SelectItem>
                        <SelectItem                 aria-labelledby="Input"
                                                    key="Complete">Hoàn thành</SelectItem>
                        <SelectItem                 aria-labelledby="Input"
                                                    key="Cancel">Đã hủy</SelectItem>
                    </Select>
                </div>
            </CardHeader>
            <CardBody                 aria-labelledby="Input"
                                      className="p-0">
                <Table                 aria-labelledby="Input"
                                       aria-label="Tasks table" className="min-w-full text-sm">
                    <TableHeader                aria-labelledby="Input"
                    >
                        <TableColumn>NHIỆM VỤ</TableColumn>
                        <TableColumn>MỨC ĐỘ</TableColumn>
                        <TableColumn>TRẠNG THÁI</TableColumn>
                        <TableColumn>HẠN HOÀN THÀNH</TableColumn>
                        <TableColumn>GHI CHÚ</TableColumn>
                        <TableColumn>THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody                 aria-labelledby="Input"
                                               emptyContent="Không có nhiệm vụ nào">
                        {item.map((taskUser: TaskUser) => (
                            <TableRow                 aria-labelledby="Input"
                                                      key={taskUser?.id} className="hover:bg-gray-50">
                                <TableCell                aria-labelledby="Input"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 rounded-md p-2">
                                            <ClipboardList className="text-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold text-gray-900">
                                                {taskUser?.task?.taskType?.taskName}
                                            </p>
                                            <p className="text-gray-600 line-clamp-2">
                                                {taskUser?.task?.description}
                                            </p>
                                            {taskUser?.task?.warehouses && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    📍 {taskUser?.task?.warehouses?.warehouseName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        color={levelColorMap[taskUser?.task?.level || "success"]}
                                        variant="flat"
                                        startContent={taskUser?.task?.level === 'High' ? <AlertTriangle className="text-yellow-500" /> :
                                            taskUser?.task?.level === 'Medium' ? <MinusCircle className="text-orange-500" /> :
                                                <CheckCircle className="text-green-600" />
                                        }
                                    >
                                        {getLevelText(taskUser?.task?.level)}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        color={statusColorMap[taskUser?.status]}
                                        variant="flat"
                                        startContent={taskUser?.status === 'Pending' ? <Clock className="text-gray-500" /> :
                                            taskUser?.status === 'In_Progress' ? <PlayCircle className="text-blue-500" /> :
                                                taskUser?.status === 'Complete' ? <CheckCircle className="text-green-600" /> :
                                                    <XCircle className="text-red-500" />
                                        }
                                    >
                                        {getStatusText(taskUser?.status)}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {taskUser?.completeAt ? (
                                            <>
                                                <div className="font-medium">
                                                    {new Date(taskUser.completeAt).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div className="text-gray-500">
                                                    {new Date(taskUser.completeAt).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Chưa xác định</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-40">
                                        <p className="line-clamp-2 text-gray-600">
                                            {taskUser?.note || 'Không có ghi chú'}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        <Tooltip content="Xem chi tiết">
                                            <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => onViewDetail(taskUser)}>
                                                <Eye />
                                            </Button>
                                        </Tooltip>

                                        {taskUser?.status === "Pending" && (
                                            <Tooltip content="Bắt đầu nhiệm vụ">
                                                <Button isIconOnly size="sm" variant="light" color="success" onPress={() => onStartTask(taskUser)}>
                                                    <PlayCircle />
                                                </Button>
                                            </Tooltip>
                                        )}

                                        {taskUser?.status === "In_Progress" && (
                                            <Tooltip content="Hoàn thành nhiệm vụ">
                                                <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => onCompleteTask(taskUser)}>
                                                    <CheckCircle />
                                                </Button>
                                            </Tooltip>
                                        )}

                                        {(taskUser?.status === "Pending" || taskUser?.status === "In_Progress") && (
                                            <Tooltip content="Hủy nhiệm vụ">
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onCancelTask(taskUser)}>
                                                    <XCircle />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default TasksTable;