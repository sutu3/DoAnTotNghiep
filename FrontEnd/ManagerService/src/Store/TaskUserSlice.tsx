import { createSlice} from "@reduxjs/toolkit";



/*
enum('ASSIGNED','CANCELED','COMPLETED','IN_PROGRESS')
*/
export interface TaskUserCreate {
    status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"| string;
    note: string;
    completeAt: string;

}
const initialState = {

};
const TaskUserSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
       /* initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },*/
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
export default TaskUserSlice;
