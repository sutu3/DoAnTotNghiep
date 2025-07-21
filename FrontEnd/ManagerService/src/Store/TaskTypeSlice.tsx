import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {callApiThunk} from "@/Store/Store.tsx";

interface Warehouse {
    warehouseName: string;
    managerId: string;
}

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
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            await dispatch(AddTaskType({payload: {...TaskTypeCreate,warehouses:warehouseId} }));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllTaskType = (page: pageApi) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllTaskType({ warehouseId, page }));

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
export default TaskTypeSlice;
