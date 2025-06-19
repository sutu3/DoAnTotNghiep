import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
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
            .addCase(GetAllTask.fulfilled, (state, action) => {
                const result: TaskType[] = (action.payload as any)?.result?.content;
                state.taskTypes=result;
            })

    },
});
export const GetAllTask = createAsyncThunk(
    "stack/getAllTask", // sửa tên action đúng với mục đích
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue },
    ) => await
        callApiThunk("GET",API_ROUTES.warehouse.task.search(page,warehouseId),undefined,rejectWithValue)
);
export const MiddleGetAllTask = (page: pageApi) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllTask({ warehouseId, page }));

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
