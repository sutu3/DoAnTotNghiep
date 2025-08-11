import { createSlice} from "@reduxjs/toolkit";
import {UserData} from "@/Store/UserSlice.tsx";
import { TaskNoList} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";
import {stats} from "@/Hooks/useTask.tsx";




export interface TaskUser {
    id: string;
    user: UserData;
    task:TaskNoList;
    evidenceImages?:string;
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
        },
        setUpdateTaskUsers: (state, action) => {
            const updatedTaskUser = action.payload;
            const index = state.taskUsers.findIndex(taskUser => taskUser.id === updatedTaskUser.id);
            if (index !== -1) {
                state.taskUsers[index] = updatedTaskUser;
            } else {
                state.taskUsers= [...state.taskUsers, updatedTaskUser];
            }
        }
    },
});

export const {setTaskUsers, initToTalPage,setUpdateTaskUsers} = TaskUserSlice.actions;

export default TaskUserSlice;
