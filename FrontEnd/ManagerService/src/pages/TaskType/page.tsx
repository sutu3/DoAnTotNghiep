import {useEffect, useState} from 'react';
import {Plus} from "lucide-react";
import TaskTypeCard from "@/components/Admin/TaskTypeItem.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import InputTaskType from "@/components/Admin/TaskType/InputTaskType.tsx";
import {TaskTypeSelector, TotalPageTask} from "@/Store/Selector.tsx";
import {useDispatch, useSelector} from "react-redux";
import {pageApi} from "@/Constants/UrlApi.tsx";
import CustomPagination from "@/components/UI/Pagination/PaginationUI.tsx";
import CardUI from "@/components/Admin/Dashboard/CardUI.tsx";
import {useNavigate} from "react-router-dom";
import {MiddleAddTaskType, MiddleGetAllTaskType, TaskType, TaskTypeCreated} from "@/Store/TaskTypeSlice.tsx";
import TaskTypeForm from "@/components/Form/TaskTypeForm.tsx";

const taskTypeStats = [
    {
        title: "Total TaskType Types",
        value: 24,
        change: "12%",
        changeType: "positive",
        iconName: "solar:document-text-outline",
        onActionClick: () => console.log("Navigate to all task types"),
    },
    {
        title: "Active TaskType Types",
        value: 18,
        change: "0.0%",
        changeType: "neutral",
        iconName: "solar:check-circle-linear",
        onActionClick: () => console.log("Show active task types"),
    },
    {
        title: "Deprecated TaskType Types",
        value: 6,
        change: "5%",
        changeType: "negative",
        iconName: "solar:close-circle-linear",
        onActionClick: () => console.log("View deprecated task types"),
    },
];

const AdminTaskPage = () => {
    const dispatch = useDispatch();
    const naviagate=useNavigate();
    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<TaskTypeCreated>({
        taskName: "",
        description: "",
        warehouses: "",
    });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const PageApi: pageApi = { pageNumber: page - 1, pageSize: 8 };
        const fetchData = async () => {
            (dispatch as any)(MiddleGetAllTaskType(PageApi));
        };

        fetchData();
    }, [page]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };

    const TaskTypeList: TaskType[] = useSelector(TaskTypeSelector);
    const totalPage = useSelector(TotalPageTask);

    const handleAddTaskType = async () => {
        await (dispatch as any)(MiddleAddTaskType(formData));
        setIsOpen(false);
        setFormData({ taskName: "", description: "", warehouses: "" });

    };

    const handleOpen = () => {
        setIsOpen(!isOpen);

    };
    const isSidebarCollapsed = localStorage.getItem("theme") !== "light";

    const handleCardClick = (task: TaskType) => {
        naviagate(`/admin/tasks?idTaskType=${task.taskTypeId}`);
        console.log("Card clicked for task:", task.taskTypeId);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-6">
            {/* Breadcrumb + Stats + Title */}
            <div className="mb-8 space-y-4">
                <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                <CardUI data={taskTypeStats} />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks Page</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage and monitor Task Types.</p>
                </div>
            </div>

            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <InputTaskType
                    onChange={setName}
                    defaultValue={name}
                    label={""}
                    placeholder="Search task type..."
                    type="text"
                />
                <button
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Add New Task
                </button>
            </div>

            {/* Grid of TaskType Type Cards */}
            {TaskTypeList.length === 0 ? (
                <div className="text-center text-gray-800 dark:text-gray-100 text-xl mt-10">
                    No task types available. Add one above!
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {TaskTypeList.slice(0, 8).map((task) => (
                            <TaskTypeCard
                                key={task.taskTypeId}
                                taskType={task}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <CustomPagination
                            page={page}
                            setPage={setPage}
                            totalPages={totalPage}
                        />
                    </div>
                </>
            )}

            <ModalUI
                footer={
                    <ButtonUI
                        className="bg-gradient-to-tr from-green-500 to-emerald-400 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200 hover:from-green-600 hover:to-emerald-500 active:scale-95 px-6 py-3 rounded-xl text-sm flex items-center gap-2"
                        label="Add Tasks"
                        loading={false}
                        startContent={<Plus size={18} />}
                        onClick={handleAddTaskType}
                    />
                }
                isOpen={isOpen}
                title="Thêm Loại Nhiệm vụ"
                onOpenChange={setIsOpen}
            >
                <TaskTypeForm data={formData} onChange={handleChange} />
            </ModalUI>
        </div>
    );
};

export default AdminTaskPage;
