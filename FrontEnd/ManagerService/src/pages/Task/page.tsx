import {useEffect, useState} from 'react';
import { Plus} from "lucide-react"; // Import the Plus icon for the button
import TaskTypeCard from "@/components/Admin/TaskTypeItem.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import TaskForm from "@/components/Form/TaskForm.tsx";
import InputTaskType from "@/components/Admin/TaskType/InputTaskType.tsx";
import {MiddleGetAllTask, TaskType, TaskTypeCreated} from "@/Store/TaskSlice.tsx";
import {TaskTypeSelector} from "@/Store/Selector.tsx";
import {useDispatch, useSelector} from "react-redux";
import {pageApi} from "@/Constants/UrlApi.tsx";
import CustomPagination from "@/components/UI/Pagination/PaginationUI.tsx";


const AdminTaskPage = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<TaskTypeCreated>({
        taskName: "",
        description: "",
        warehouses: "",
    });
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        const PageApi: pageApi = { pageNumber: page - 1, pageSize: pageSize - 2 };
        const fetchData = async () => {
            (dispatch as any)(MiddleGetAllTask(PageApi));
        };

        fetchData();
    }, [page, pageSize]);
    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };
    // Initial mock task data (using an array now)
    const TaskTypeList: TaskType[] = useSelector(TaskTypeSelector);
    // Mock function to add a new task
    const handleAddTask = () => {
        setIsOpen(!isOpen) // For debugging
        // In a real app, you would navigate to a creation form or show a modal
    };
    const isSidebarCollapsed = localStorage.getItem("theme") != "light";

    // Optional: Handle card click (e.g., navigate to view/edit task details)
    const handleCardClick = (task: TaskType) => {
        console.log("Card clicked for task:", task.taskTypeId);
        // Example: Router.push(`/admin/tasks/${task.taskTypeId}`);
    }

    return (
        // Added overall page padding and background color
        <div className="min-h-screen bg-white dark:bg-gray-900 sm:p-2 lg:p-4">

            {/* Header with title and Add button */}
            <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <BreadcrumbsUI isDarkMode={isSidebarCollapsed}/>

                <div className="sm:text-right">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Tasks Page
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage and monitor Task.
                    </p>
                </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <InputTaskType
                  onChange={setName} defaultValue={name} label={""} placeholder={"Enter Name"} type={"text"}/>

                {/* Add New Task Button */}
                <button
                    onClick={handleAddTask}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <Plus size={20}/> {/* Plus icon from lucide-react */}
                    Add New Task
                </button>
            </div>

            {/* Task Type Grid */}
            {TaskTypeList.length === 0 ? (
                // Message if no tasks are available
                <div className="text-center text-gray-800 dark:text-gray-100 text-xl mt-10">
                    No task types available. Add one above!
                </div>
            ) : (
                // The grid container for the cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {TaskTypeList.map(task => (
                        // Render a TaskTypeCard for each task in the state
                        <TaskTypeCard
                            key={task.taskTypeId} // Use the unique ID as the key
                            taskType={task} // Pass the task data down as a prop
                            onClick={handleCardClick} // Pass the click handler
                        />
                    ))}
                    <CustomPagination
                        page={page}
                        setPage={setPage}
                        totalPages={Math.ceil(TaskTypeList.length / pageSize)}
                    />
                </div>

            )}
            <ModalUI
                footer={
                    <ButtonUI
                        className="
                            bg-gradient-to-tr from-green-500 to-emerald-400
                            text-white font-semibold
                            shadow-md hover:shadow-xl
                            transition-all duration-200
                            hover:from-green-600 hover:to-emerald-500
                            active:scale-95
                            px-6 py-3
                            rounded-xl
                            text-sm
                            flex items-center gap-2
  "
                        label={"Add Tasks"}
                        loading={false}
                        startContent={<Plus size={18}/>}
                        onClick={() => console.log("")}
                    />

                }
                isOpen={isOpen}
                title="Thêm Loại Nhiệm vụ"
                onOpenChange={setIsOpen}
            >
                <TaskForm data={formData} onChange={handleChange}/>
            </ModalUI>
        </div>
    );
};

export default AdminTaskPage;