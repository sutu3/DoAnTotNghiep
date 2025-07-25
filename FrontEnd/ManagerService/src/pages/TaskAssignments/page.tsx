import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner
} from '@heroui/react';
import { Edit3, Save, X, Plus, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { TaskTypeSelector, TotalPageTask } from '@/Store/Selector';
import {MiddleGetAllTaskType, MiddleUpdateTaskType, TaskType, TaskTypeCreated} from '@/Store/TaskTypeSlice';
import TaskTypeEditModal from "@/components/Admin/Tasks/Modal/TaskTypeEditModal.tsx";
import TaskTypeCreateModal from "@/components/Admin/Tasks/Modal/TaskTypeCreateModal.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import SelectWarehouse from "@/components/Admin/Tasks/SelectWarehouse.tsx";

const TaskAssignmentsPage = () => {
    const dispatch = useDispatch();
    const taskTypes = useSelector(TaskTypeSelector);
    const totalPage = useSelector(TotalPageTask);

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTaskType, setSelectedTaskType] = useState<TaskTypeCreated>({
        description: "",
        taskName: "",
        warehouses: ""
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [warehouse,setWarehouse] = useState<string>("");
    useEffect(() => {
        loadTaskTypes();
    }, [page,warehouse]);

    const loadTaskTypes = async () => {
        setLoading(true);
        try {

            const page:pageApi={pageNumber: 0, pageSize: 10}
            if(warehouse!=""){
                await (dispatch as any)(MiddleGetAllTaskType(warehouse,page ));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditStart = (taskType: TaskType) => {
        console.log(taskType.taskTypeId)
        setEditingId(taskType.taskTypeId);
        setEditingName(taskType.taskName);
    };

    const handleEditSave = async (taskTypeId: string) => {
        if (!editingName.trim()) return;

        setLoading(true);
        try {
            const taskUpdate:TaskTypeCreated={...selectedTaskType,taskName:editingName}
            await (dispatch as any)(MiddleUpdateTaskType(taskTypeId,taskUpdate));

            setEditingId(null);
            setEditingName('');
        } catch (error) {
            console.error('Error updating task type:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleDetailEdit = (taskType: TaskType) => {
        console.log(taskType);
        const tasktypeEdit:TaskTypeCreated={
            taskName:taskType.taskName,
            description:taskType.description,
            warehouses:taskType?.warehouses?.warehouseId
        }
        setEditingId(taskType.taskTypeId);
        setSelectedTaskType(tasktypeEdit);
        setIsEditModalOpen(true);
    };

    const filteredTaskTypes = taskTypes?.filter((taskType: TaskType) =>
        taskType.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        taskType.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                                    <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        Quản lý phân công nhiệm vụ
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Chỉnh sửa và quản lý các loại nhiệm vụ trong kho
                                    </p>
                                </div>
                            </div>

                            <Button
                                color="primary"
                                startContent={<Plus className="w-4 h-4" />}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Thêm loại nhiệm vụ
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="flex gap-4">
                            <Input
                                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                startContent={<Search className="w-4 h-4 text-gray-400" />}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Task Types Table */}
                <Card className="shadow-lg">
                    <CardHeader className={"flex items-center justify-between"}>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Danh sách loại nhiệm vụ ({filteredTaskTypes.length})
                        </h2>
                        <SelectWarehouse warehouse={warehouse} setWarehouse={setWarehouse}/>
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Task types table">
                            <TableHeader>
                                <TableColumn>TÊN NHIỆM VỤ</TableColumn>
                                <TableColumn>MÔ TẢ</TableColumn>
                                <TableColumn>KHO</TableColumn>
                                <TableColumn>THAO TÁC</TableColumn>
                            </TableHeader>
                            <TableBody  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                        isLoading={loading}
                                        loadingContent={<Spinner label="Loading..." />}
                                        emptyContent="No Task Type found">
                                {filteredTaskTypes.map((taskType: TaskType) => (
                                    <TableRow key={taskType.taskTypeId}>
                                        <TableCell>
                                            {editingId === taskType.taskTypeId ? (
                                                <Input
                                                    value={editingName}
                                                    onValueChange={setEditingName}
                                                    size="sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    {taskType.taskName}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                                                {taskType.description || 'Không có mô tả'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-blue-600 dark:text-blue-400 text-sm">
                                                {taskType.warehouses?.warehouseName || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {editingId === taskType.taskTypeId ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            color="success"
                                                            variant="light"
                                                            startContent={<Save className="w-3 h-3" />}
                                                            onClick={() => handleEditSave(taskType.taskTypeId)}
                                                            isLoading={loading}
                                                        >
                                                            Lưu
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            startContent={<X className="w-3 h-3" />}
                                                            onClick={handleEditCancel}
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            variant="light"
                                                            startContent={<Edit3 className="w-3 h-3" />}
                                                            onClick={() => handleEditStart(taskType)}
                                                        >
                                                            Sửa tên
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="secondary"
                                                            variant="light"
                                                            onClick={() => handleDetailEdit(taskType)}
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                {/* Modals */}
                <TaskTypeCreateModal
                    warehouse={warehouse}
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={loadTaskTypes}
                />

                <TaskTypeEditModal
                    setEditId={setEditingId}
                    taskTypeId={editingId}
                    warehouse={warehouse}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    taskType={selectedTaskType}
                    onSuccess={loadTaskTypes}
                />
            </div>
        </div>
    );
};

export default TaskAssignmentsPage;


