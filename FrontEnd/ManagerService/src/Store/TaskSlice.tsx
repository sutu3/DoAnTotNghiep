import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import { TaskTypeCreated} from "@/Store/TaskTypeSlice.tsx";
import {TaskUserCreate} from "@/Store/TaskUserSlice.tsx";

interface Warehouse {
    warehouseName: string;
    managerId: string;
}
export const columns = [
    { name: "ID", uid: "taskId", sortable: true },
    { name: "Task Type", uid: "taskType", sortable: true },
    { name: "Description", uid: "description", sortable: true },
    { name: "Level", uid: "level", sortable: true },
    { name: "Complete", uid: "completeAt" },
    { name: "Warehouse Name", uid: "warehouseName" },
    { name: "STATUS", uid: "statusTask", sortable: true },
    { name: "USERS", uid: "taskUsers", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];
export interface Task {
    taskId: string;
    taskType: TaskTypeCreated
    status: "Pending" | "In_Progress" | "Complete"| "Cancel" | string; // Enum if possible
    level: "Low" | "Medium" | "Hight" | string; // Enum nếu backend cố định giá trị
    description: string;
    taskUsers: TaskUserCreate[];
    warehouses: Warehouse
    completeAt: string; // ISO date string
}
export interface TaskCreated {
    taskType: string|undefined;
    level: string; // Enum nếu backend cố định giá trị
    description: string;
    completeAt: string;
    warehouses:string,
}
interface TaskState  {
    tasks: Task[],
    totalPage: number,
}


const initialState: TaskState = {
    tasks: [],
    totalPage:0,
};
const TaskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAllTask.fulfilled, (state, action) => {
                const result: Task[] = (action.payload as any)?.result?.content;
                state.tasks=result;
            })
            .addCase(AddTask.fulfilled, (state, action) => {
                const result: Task = (action.payload as any)?.result;
                state.tasks=[...state.tasks,result];
            })

    },
});
export const GetAllTask = createAsyncThunk(
    "task/getAllTask", // sửa tên action đúng với mục đích
    async (
        { warehouseId, page,taskTypeId }: { warehouseId: string; page: pageApi,taskTypeId: string },
        { rejectWithValue },
    ) => await
        callApiThunk("GET",API_ROUTES.user.task.search(page,warehouseId).GetAll.ByIdTaskType(taskTypeId),undefined,rejectWithValue)
);
export const AddTask=createAsyncThunk(
    "task/AddTask",
    async (
        {payload}: { payload: TaskCreated },{rejectWithValue},
    )=>await
        callApiThunk("POST",API_ROUTES.user.task.addTask,payload,rejectWithValue)
);
export const MiddleAddTask = ( CreateTask:TaskCreated ) => {
    return async function check(dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            console.log(warehouseId)
            console.log({...CreateTask,warehouses:warehouseId})

            const action = await dispatch(AddTask({payload: {...CreateTask,warehouses:warehouseId}}));

            dispatch(
                TaskSlice.actions.initToTalPage(action.payload.result.totalPages),
            );
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
}
export const MiddleGetAllTask = (page: pageApi, taskTypeId: string | null) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllTask({ warehouseId, page,taskTypeId }));
            dispatch(
                TaskSlice.actions.initToTalPage(action.payload.result.totalPages),
            );
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export default TaskSlice;
