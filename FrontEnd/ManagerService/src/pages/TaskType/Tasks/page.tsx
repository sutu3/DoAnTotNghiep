import TableUI from "@/components/UI/Table/TableUI.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {useEffect, useState} from "react";
import {pageApi} from "@/Constants/UrlApi.tsx";
import {useDispatch, useSelector} from "react-redux";
import {columns, MiddleAddTask, MiddleGetAllTask, Task, TaskCreated} from "@/Store/TaskSlice.tsx";
import { useSearchParams} from "react-router-dom";
import {TaskSelector, TaskTypeSelector} from "@/Store/Selector.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import {Layers} from "lucide-react";
import StackForm from "@/components/Form/StackForm.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import TaskForm from "@/components/Form/TaskForm.tsx";
import {MiddleAddStack} from "@/Store/StackSlice.tsx";
import {TaskType} from "@/Store/TaskTypeSlice.tsx";

const TasksPage = () => {
    const Task:Task[]=useSelector(TaskSelector);
    const dispatch = useDispatch();
    const [searchParams]=useSearchParams()
    const idTaskType = searchParams.get("idTaskType");
    const allTaskTypes: TaskType[] = useSelector(TaskTypeSelector);
    const taskTypeInfo = allTaskTypes?.find(
        (t: TaskType) => t.taskTypeId === idTaskType
    );
    const isSidebarCollapsed =
        localStorage.getItem("theme") == "light" ? true : false;
    const INITIAL_VISIBLE_COLUMNS = [
        "taskType",
        "description",
        "statusTask",
        "completeAt",
        "warehouseName",
        "taskUsers",
        "level",
        "actions",
    ];
    const [page, setPage] = useState(1);
    const [isOpen,setIsOpen]=useState(false);
    const [formData,setFormData]=useState<TaskCreated>({
        description:"",
        warehouse:"",
        taskType:"",
        level:"",
        completeAt: ""
    });
    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };
    const handleGetIdTask = (taskId: string) => {
        console.log(taskId);
    }
    const handleOpenModel=()=>{
        setIsOpen(!isOpen);
    }
    const handleAddStack=async ()=>{
          await (dispatch as any)(MiddleAddTask({...formData,taskType:taskTypeInfo?.taskName}));
        setIsOpen(false);
        setFormData({
            warehouse:"",
            taskType: "",
            description:"",
            level:"",
            completeAt:""
        })
    }
    useEffect(() => {
        const PageApi: pageApi = { pageNumber: page - 1, pageSize: 8 };
        const fetchData = async () => {
            (dispatch as any)(MiddleGetAllTask(PageApi,idTaskType));
        };

        fetchData();
    }, [page]);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* 3. Phần Header của trang - ĐÃ CẬP NHẬT */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    {/* Bên trái: Breadcrumbs */}
                    <div>
                        <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                    </div>

                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Product Page
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your products efficiently.
                        </p>
                    </div>
                </div>

                {/* 4. Phần Nội dung - TableUI trong một "card" */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="p-0 md:p-4">
                        <TableUI
                            columns={columns}
                            getId={(objects) =>
                                String(objects?.userId || objects?.stackId || objects?.id || ""||objects?.taskId)
                            }
                            isDarkMode={isSidebarCollapsed}
                            objects={Task}
                            pageNumber={1}
                            onchange={handleOpenModel}
                            pageSize={10}
                            totalPage={1}
                            visibleColumn={INITIAL_VISIBLE_COLUMNS}
                            onGetId={(taskId) => {handleGetIdTask(taskId)}}
                            onPageChange={() => {}}
                        />
                    </div>
                </div>
            </div>
            <ModalUI
                size={"2xl"}
                footer={
                    <ButtonUI
                        className={
                            "bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"
                        }
                        label={"Add Task"}
                        loading={false}
                        startContent={<Layers />}
                        onClick={handleAddStack}
                    />
                }
                isOpen={isOpen}
                title="Thêm Mới Nhiệm vu"
                onOpenChange={setIsOpen}
            >
                <TaskForm taskType={taskTypeInfo} data={formData} onChange={handleChange} />
            </ModalUI>
        </div>
    );
};

export default TasksPage;
