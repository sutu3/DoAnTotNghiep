import { createSlice} from "@reduxjs/toolkit";
import {UserData} from "@/Store/UserSlice.tsx";



/*
enum('ASSIGNED','CANCELED','COMPLETED','IN_PROGRESS')
*/
export interface TaskUser {
    id: string;
    user: UserData;
    status: string; // tùy enum bạn dùng
    note: string;
    completeAt: string; // ISO date string, thường từ backend sẽ là kiểu này
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}



export interface TaskTypeResponse {
    taskTypeId: string;
    taskName: string;
    description?: string;
}

export interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export interface TaskUserAssignment {
    user: string;
    note: string;
    completeAt: string;
}
export interface TaskUserCreate {
    status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"| string;
    note: string;
    completeAt: string;

}
interface TaskUserState {
    taskUsers: TaskUser[];
    totalPage: number;
}
const initialState:TaskUserState = {
    taskUsers:[],
    totalPage: 0,
};
const TaskUserSlice = createSlice({
    name: "taskUser",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setTaskUsers: (state, action) => {
            state.taskUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            /*.addCase(GetAllTask.fulfilled, (state, action) => {

            })*/

    },
});
/*export const GetAllTask = createAsyncThunk(
    "stack/getAllTask", // sửa tên action đúng với mục đích
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue },
    ) => await
        callApiThunk("GET",API_ROUTES.user.task.search(page,warehouseId).GetAll,undefined,rejectWithValue)
);
export const MiddleGetAllTask = (page: pageApi) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllTask({ warehouseId, page }));

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
};*/
export const {setTaskUsers, initToTalPage} = TaskUserSlice.actions;

export default TaskUserSlice;
