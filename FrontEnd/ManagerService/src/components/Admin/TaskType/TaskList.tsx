import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardHeader, Chip, Button, Select, SelectItem} from '@heroui/react';
import { Package, Clock, User, MapPin, Eye } from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllTaskType, TaskType} from "@/Store/TaskTypeSlice.tsx";
import {TaskTypeSelector} from "@/Store/Selector.tsx";
import {Task} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";

interface TaskListProps {
    taskType:string;
    setTaskType:(taskType:string) => void;
    warehouse:string;
    tasks: any[];
    loading: boolean;
    onTaskUpdate: () => void;
    onViewDetail: (task: any) => void; // Thêm prop mới
}

const TaskList: React.FC<TaskListProps> = ({taskType,setTaskType,
                                               warehouse,
                                               tasks,
                                               onViewDetail   }) => {
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const taskTypes=useSelector(TaskTypeSelector);
    const dispatch = useDispatch();
    useEffect(() => {
        const  fetch=async()=>{
            if(warehouse!=""){
                await (dispatch as any)(MiddleGetAllTaskType(warehouse,{pageNumber:0,pageSize:10} ));
            }        }
        if(warehouse!=""){
            fetch();
        }
    }, [warehouse]);

    const handleTaskClick = (task: any) => {
        setSelectedTask(task);
    };

    const getTaskIcon = (taskType: string) => {
        switch (taskType?.toLowerCase()) {
            case 'inventory': return <Package className="w-5 h-5" />;
            case 'picking': return <MapPin className="w-5 h-5" />;
            case 'receiving': return <Package className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Danh sách nhiệm vụ ({tasks?.length || 0})
                    </h2>
                    <Select
                        label="Loại nhiệm vụ"
                        placeholder="Chọn loại nhiệm vụ"
                        selectedKeys={taskType ? [taskType] : []}
                        onSelectionChange={(keys) => {
                            const selectedName = Array.from(keys)[0]?.toString();
                            if (selectedName) {
                                setTaskType(selectedName);
                            }
                        }}
                        isRequired
                        variant="bordered"
                    >
                        {taskTypes?.map((taskType: TaskType) => (
                            <SelectItem
                                key={taskType.taskName}
                                value={taskType.taskName}
                                textValue={taskType.taskName}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{taskType.taskName}</span>
                                    <span className="text-xs text-gray-500">{taskType.description}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    {tasks?.map((task: Task) => (
                        <Card
                            key={task.taskId}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedTask?.taskId === task.taskId ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => handleTaskClick(task)}
                        >
                            <CardBody className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                                            {task?.taskType?.taskName}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {task?.taskType?.taskName|| 'Nhiệm vụ kho'}
                                                </h3>
                                                <Chip
                                                    size="sm"
                                                    color={task.level === 'high' ? 'danger' :
                                                        task.level === 'medium' ? 'warning' : 'success'}
                                                    variant="flat"
                                                >
                                                    {task.level === 'high' ? 'Cao' :
                                                        task.level === 'medium' ? 'Trung bình' : 'Thấp'}
                                                </Chip>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {task.description || 'Không có mô tả'}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{task.taskUsers?.length || 0} người</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{task?.warehouses?.warehouseName || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {task.completeAt ?
                                                            new Date(task.completeAt).toLocaleDateString('vi-VN') :
                                                            'Chưa có hạn'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Chip
                                                color={task.status === 'Complete' ? 'success' :
                                                    task.status === 'In_Progress' ? 'primary' : 'warning'}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {task.status === 'Complete' ? 'Hoàn thành' :
                                                    task.status === 'In_Progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                                            </Chip>

                                            <Button
                                                size="sm"
                                                variant="light"
                                                startContent={<Eye className="w-3 h-3" />}
                                                onClick={() => onViewDetail(task)} // Gọi handler
                                            >
                                                Chi tiết
                                            </Button>
                                        </div>
                                    </div>


                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default TaskList;