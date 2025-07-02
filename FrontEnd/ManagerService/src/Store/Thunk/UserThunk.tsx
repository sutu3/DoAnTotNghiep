import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {initToTalPage, setUserList} from "@/Store/UserSlice.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const GetAllUser = createAsyncThunk(
    "user/GetAllUser",
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.users(page).search.byWarehouseId(warehouseId).getAll,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllUser = (page: pageApi) => {
    return async function (dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllUser({ warehouseId, page }));

            dispatch(setUserList(action.payload.result.content));
            dispatch(initToTalPage(action.payload.result.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};