import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";



export interface TaskType {
    taskTypeId: string;
    taskName: string;
    description: string;
    warehouses?: Warehouse;
    createdAt: string;
}

export interface TaskTypeCreated {
    taskName: string;
    description: string;
    warehouses?: string;
}

interface TaskTypeState {
    taskTypes: TaskType[];
    totalPage: number;
}
const initialState: TaskTypeState = {
    taskTypes: [],
    totalPage:0,
};
const TaskTypeSlice = createSlice({
    name: "taskType",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        updateTaskType: (state, action) => {
            const result:TaskType = action.payload
            state.taskTypes=state.taskTypes.filter((el:TaskType)=>el.taskTypeId==result.taskTypeId?result:el)
        },
        setGetTaskType: (state, action) => {
            state.taskTypes = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAllTaskType.fulfilled, (state, action) => {
                const result: TaskType[] = (action.payload as any)?.result?.content;
                state.taskTypes=result;
            })
            .addCase(AddTaskType.fulfilled, (state, action) => {
                const result: TaskType = (action.payload as any)?.result;
                state.taskTypes=[...state.taskTypes,result];
            })

    },
});
export const GetAllTaskType = createAsyncThunk(
    "taskType/GetAllTaskType", // sửa tên action đúng với mục đích
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue },
    ) => await
        callApiThunk("GET",API_ROUTES
            .user
            .taskType(page)
            .search
            .byWarehouseId(warehouseId)
            .getAll,undefined,rejectWithValue)
);
export const EditTaskType = createAsyncThunk(
    "taskType/EditTaskType", // sửa tên action đúng với mục đích
    async (
        { taskTypeId, taskUpdate }: { taskTypeId: string; taskUpdate: TaskTypeCreated },
        { rejectWithValue },
    ) => await
        callApiThunk("PUT",API_ROUTES
            .user
            .taskType(null)
            .updateTaskType(taskTypeId)
            ,taskUpdate,rejectWithValue)
);
export const EditDescriptionTaskType = createAsyncThunk(
    "taskType/EditDescriptionTaskType", // sửa tên action đúng với mục đích
    async (
        { taskTypeId, description }: { taskTypeId: string; description: string },
        { rejectWithValue },
    ) => await
        callApiThunk("PUT",API_ROUTES
                .user
                .taskType(null)
                .updateDescriptionTaskType(taskTypeId)
            , {description},rejectWithValue)
);
export const AddTaskType=createAsyncThunk(
    "taskType/AddTaskType",
    async (
        {payload}:{payload: TaskTypeCreated},
        {rejectWithValue},
        )=>await
        callApiThunk("POST",API_ROUTES
            .user
            .taskType(null)
            .addTask,payload,rejectWithValue)
);
export const MiddleAddTaskType = (TaskTypeCreate:TaskTypeCreated) => {
    return async function check(dispatch: any) {
        try {
            await dispatch(AddTaskType({payload: {...TaskTypeCreate} }));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllTaskType = (warehouse:string,page: pageApi) => {
    return async function check(dispatch: any) {
        try {
            const action = await dispatch(GetAllTaskType({ warehouseId:warehouse, page }));

            dispatch(
                TaskTypeSlice.actions.initToTalPage(action.payload.result.totalPages),
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
export const MiddleUpdateTaskType = (taskTypeId:string,taskUpdate: TaskTypeCreated) => {
    return async function check(dispatch: any) {
        try {
            const action = await dispatch(EditTaskType({ taskTypeId, taskUpdate }));
            dispatch(
                TaskTypeSlice.actions.updateTaskType(action.payload.result),
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
export const MiddleUpdateDescriptionTaskType = (taskTypeId:string,description: string) => {
    return async function check(dispatch: any) {
        try {
            const action = await dispatch(EditDescriptionTaskType({ taskTypeId, description }));
            dispatch(
                TaskTypeSlice.actions.updateTaskType(action.payload.result),
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
export const {setGetTaskType} = TaskTypeSlice.actions;
export default TaskTypeSlice;
