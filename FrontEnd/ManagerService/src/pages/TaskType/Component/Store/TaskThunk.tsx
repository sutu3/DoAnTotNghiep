import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import  { setUpdateTask} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";

export const UpdateTaskStatus=createAsyncThunk(
    "task/UpdateTaskStatus",
    async (
        {taskId,status}: { taskId: string,status:string },{rejectWithValue},
    )=>await
        callApiThunk("PUT",
            API_ROUTES.user.tasks(null).updateStatus(taskId),
            {status},
            rejectWithValue)
);

export const MiddleUpdateTaskStatus = (taskId: string,status:string ) => {
    return async function check(dispatch: any) {
        try {

            const action = await dispatch(UpdateTaskStatus({ taskId, status }));
            dispatch(
                setUpdateTask(action.payload.result),
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