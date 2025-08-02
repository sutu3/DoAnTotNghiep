"use client";

import { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {MiddleGetAllTaskUserByUserId, MiddleUpdateTaskUser} from "@/pages/TaskType/Component/Store/TaskUserThunk.tsx";
import {TaskUserSelector} from "@/Store/Selector.tsx";
import TasksTable from "@/pages/TaskType/Component/Table/TasksTable";
import TaskDetailModal from "@/pages/TaskType/Component/Modal/TaskDetailModal";
import CancelTaskModal from "@/pages/TaskType/Component/Modal/CancelTaskModal";
import CompleteTaskModal from "@/pages/TaskType/Component/Modal/CompleteTaskModal";
import {TaskUser} from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";
import TaskStatsCards from "@/pages/TaskType/Component/Card/TaskStatsCards.tsx";
import {MiddleUploadImage, UploadResponse} from "@/Store/Thunk/UploadThunk.tsx";



export default function MyTasksPage() {
    const TaskUser = useSelector(TaskUserSelector);
    const [taskUsers, setTaskUsers] = useState<TaskUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTask, setSelectedTask] = useState<TaskUser | null>(null);

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0
    });

    const dispatch = useDispatch();

    useEffect(() => {
        loadUserTasks();
    }, []);

    useEffect(() => {
        if (TaskUser) {
            setTaskUsers(TaskUser);
            calculateStats(TaskUser);
        }
    }, [TaskUser]);

    const loadUserTasks = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllTaskUserByUserId({ pageNumber: 0, pageSize: 50 }));
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
            highPriority: tasks.filter(t => t?.task?.level === "High").length
        };
        setStats(stats);
    };

    const handleViewDetail = (taskUser: TaskUser) => {
        setSelectedTask(taskUser);
        setIsDetailModalOpen(true);
    };

    const handleStartTask = (taskUser: TaskUser) => {
        setSelectedTask(taskUser);
        // Directly update status to In_Progress
        handleUpdateStatus(taskUser.id, "In_Progress");
    };

    const handleCompleteTask = (taskUser: TaskUser) => {
        setSelectedTask(taskUser);
        setIsCompleteModalOpen(true);
    };

    const handleCancelTask = (taskUser: TaskUser) => {
        setSelectedTask(taskUser);
        setIsCancelModalOpen(true);
    };

    const handleUpdateStatus = async (taskUserId: string,status:string) => {
        try {
            // API call logic here
            await (dispatch as any)(MiddleUpdateTaskUser(taskUserId,status,null));
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };
    const handleUpdateCompleteStatus = async (taskUserId: string,status:string) => {
        try {
            // API call logic here
            const imageResponse:UploadResponse=await (dispatch as any)(MiddleUploadImage());
            await (dispatch as any)(MiddleUpdateTaskUser(taskUserId,status,imageResponse.urlImage));
            setIsCompleteModalOpen(false);
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };
    const handleUpdateCancelStatus = async (taskUserId: string,status:string,reason:string) => {
        try {
            // API call logic here
            await (dispatch as any)(MiddleUpdateTaskUser(taskUserId,status,reason));
            setIsCancelModalOpen(false);
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen  p-6 flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-gray-600">Đang tải nhiệm vụ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Enhanced Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4 shadow-lg">
                            <Icon icon="mdi:clipboard-list" className="text-4xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">
                                Nhiệm Vụ Của Tôi
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Quản lý và theo dõi các nhiệm vụ được giao
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <TaskStatsCards stats={stats} />

                {/* Tasks Table */}
                <TasksTable
                    taskUsers={taskUsers}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onViewDetail={handleViewDetail}
                    onStartTask={handleStartTask}
                    onCompleteTask={handleCompleteTask}
                    onCancelTask={handleCancelTask}
                />

                {/* Modals */}
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    taskUser={selectedTask}
                />

                <CancelTaskModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    taskUser={selectedTask}
                    onConfirm={(reason) => {
                        if (selectedTask) {
                            handleUpdateCancelStatus(selectedTask.id, "Cancel",reason);
                        }
                    }}
                />

                <CompleteTaskModal
                    isOpen={isCompleteModalOpen}
                    onClose={() => setIsCompleteModalOpen(false)}
                    taskUser={selectedTask}
                    onConfirm={() => {
                        if (selectedTask) {
                            handleUpdateCompleteStatus(selectedTask.id, "Complete");
                        }

                    }}
                />
            </div>
        </div>
    );
}