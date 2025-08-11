import  { useEffect, useState } from 'react';
import {  Button } from '@heroui/react';
import { Package, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {StatsSelector, TaskSelector} from '@/Store/Selector';
import TaskList from "@/components/Admin/TaskType/TaskList.tsx";
import TaskDetailModal from "@/components/Admin/TaskType/Modal/TaskDetail.tsx";
import TaskSidebar from "@/components/Admin/TaskType/TaskSidebar.tsx";
import SelectWarehouse from "@/components/Admin/Tasks/SelectWarehouse.tsx";
import {MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {MiddleGetAllTask} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";
import {MiddleGetStats, MiddleUpdateTaskStatus} from "@/pages/TaskType/Component/Store/TaskThunk.tsx";
import {useGetStatsTask} from "@/Hooks/useTask.tsx";

const StaffTaskDashboard = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(TaskSelector);
    const [loading, setLoading] = useState(false);
    const [warehouse, setWarehouse] = useState<string>("");
    const [taskType,setTaskType] = useState<string>("");
    // States cho TaskDetailModal
    const [taskId,setTaskId]= useState<string>("");
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const data=useSelector(StatsSelector);
    useEffect(() => {
        if(warehouse!=""){

            loadTasks();
        }
    }, [warehouse,taskType]);
    useEffect(() => {
       const fetch=async()=>{
           setLoading(true);
           try {
               await (dispatch as any)(MiddleGetWarehouseByUser({ pageNumber: 0, pageSize: 20 }));
           } finally {
               setLoading(false);
           }
       }
       fetch()
    }, []);
    const loadTasks = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllTask({ pageNumber: 0, pageSize: 20 },warehouse,taskType));
        } finally {
            setLoading(false);
        }
    };

    // Handler để mở modal chi tiết task
    const handleViewTaskDetail = (task: any) => {
        setSelectedTask(task);
        setTaskId(task?.taskId)
        setIsTaskDetailOpen(true);
    };

    // Handler để cập nhật status task
    const handleUpdateTaskStatus = async (taskId: string, status: string) => {
        try {
             await (dispatch as any)(MiddleUpdateTaskStatus(taskId, status));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header và Statistics - giữ nguyên */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        {/* Header content */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        Bảng điều khiển nhiệm vụ
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Quản lý và theo dõi nhiệm vụ kho hàng
                                    </p>
                                </div>
                            </div>
                            <SelectWarehouse warehouse={warehouse} setWarehouse={setWarehouse}/>
                            <Button
                                color="primary"
                                startContent={<Clock className="w-4 h-4" />}
                                onClick={loadTasks}
                                isLoading={loading}
                            >
                                Làm mới
                            </Button>
                        </div>

                        {/* Task Statistics - giữ nguyên */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Statistics cards */}
                        </div>
                    </div>
                </div>

                {/* Task Board Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Task List - Pass handler để mở modal */}
                    <div className="lg:col-span-2">
                        <TaskList
                            taskType={taskType}
                            warehouse={warehouse}
                            tasks={tasks}
                            loading={loading}
                            onTaskUpdate={loadTasks}
                            onViewDetail={handleViewTaskDetail} // Truyền handler
                            setTaskType={setTaskType}
                        />
                    </div>

                    {/* Task Details Sidebar */}
                    <div className="lg:col-span-1">
                        <TaskSidebar data={data} />
                    </div>
                </div>

                {/* TaskDetailModal */}
                <TaskDetailModal
                    taskId={taskId}
                    isOpen={isTaskDetailOpen}
                    onClose={() => setIsTaskDetailOpen(false)}
                    task={selectedTask}
                    onUpdateStatus={handleUpdateTaskStatus}
                />
            </div>
        </div>
    );
};

export default StaffTaskDashboard;