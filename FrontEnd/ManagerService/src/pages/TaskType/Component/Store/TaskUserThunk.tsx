import {
    initToTalPage,
    setTaskUsers,
    setUpdateTaskUsers,
    TaskUserAssignment
} from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import  { TaskCreated} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";

export const AddTaskUser = createAsyncThunk(
    "taskUser/AddTaskUser",
    async (
        { request,tasks }: { request: TaskCreated,tasks:TaskUserAssignment[] },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.user.taskUsers(null).addTaskUser,
            {
                request,tasks
            },
            rejectWithValue
        )
);
export const UpdateTaskUser = createAsyncThunk(
    "taskUser/UpdateTaskUser",
    async (
        { status,taskUserId }: { status: string,taskUserId:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.user.taskUsers(null).updateStatus(taskUserId),
            {
                status
            },
            rejectWithValue
        )
);
export const UpdateTaskUserComplete = createAsyncThunk(
    "taskUser/UpdateTaskUserComplete",
    async (
        { image,taskUserId }: { image: string|null,taskUserId:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.user.taskUsers(null).updateCompleted(taskUserId),
            {
                evidenceImages:image
            },
            rejectWithValue
        )
);
export const UpdateTaskUserCancel = createAsyncThunk(
    "taskUser/UpdateTaskUserCancel",
    async (
        { note,taskUserId }: { note: string|null,taskUserId:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.user.taskUsers(null).updateCancel(taskUserId),
            {
                note:note
            },
            rejectWithValue
        )
);
export const GetAllTaskUserByTaskId = createAsyncThunk(
    "taskUser/GetAllTaskUserBytaskId",
    async (
        { tasks }: { tasks:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.taskUsers(null).search().byTask(tasks),
            undefined,
            rejectWithValue
        )
);
export const GetAllTaskUserByUserId = createAsyncThunk(
    "taskUser/GetAllTaskUserByUserId",
    async (
        {page}: {page:pageApi},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.taskUsers(page).search().byUser(),
            undefined,
            rejectWithValue
        )
);
export const MiddleGetAllTaskUser = ( tasks:string) => {
    return async function check(dispatch: any) {
        try {
            const action=await dispatch(GetAllTaskUserByTaskId({tasks}));
            dispatch(setTaskUsers(action?.payload?.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
}
export const MiddleUpdateTaskUser = ( taskUserId:string,status:string,image:string|null) => {
    return async function check(dispatch: any) {
        try {
            console.log(status)
            if(status!=="Complete" && image==null){
                const action=await dispatch(UpdateTaskUser({status,taskUserId}));
                dispatch(setUpdateTaskUsers(action?.payload?.result));
            }if(status==="Cancel"&& image!=""){
                //image có thể là note
                const action=await dispatch(UpdateTaskUserCancel({note:image,taskUserId}));
                dispatch(setUpdateTaskUsers(action?.payload?.result));
            }
            if(status==="Complete"){
                const action=await dispatch(UpdateTaskUserComplete({image,taskUserId}));
                dispatch(setUpdateTaskUsers(action?.payload?.result));
            }
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
}
export const MiddleGetAllTaskUserByUserId = (page:pageApi) => {
    return async function check(dispatch: any) {
        try {
            const action=await dispatch(GetAllTaskUserByUserId({page}));
            dispatch(setTaskUsers(action?.payload?.result?.content));
            dispatch(initToTalPage(action?.payload?.result?.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
}
export const MiddleAddTaskUser = ( CreateTask:TaskCreated,taskUsers:TaskUserAssignment[] ) => {
    return async function check(dispatch: any) {
        try {
            await dispatch(AddTaskUser(
                {request: CreateTask,tasks:taskUsers}));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
}