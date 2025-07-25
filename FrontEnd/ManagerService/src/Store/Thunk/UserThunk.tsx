import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {initToTalPage, setUserList, UserCreate} from "@/Store/UserSlice.tsx";
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
export const AddUser = createAsyncThunk(
    "user/AddUser",
    async (
        { user }: { user: UserCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.user.users(null).create,
            user,
            rejectWithValue
        )
);
export const MiddleAddUser = (user: UserCreate) => {
    return async function (dispatch: any) {
        try {
            await dispatch(AddUser({user:
                    { ...user,
                        urlImage:`https://dummyimage.com/300.png/09f/fff&text=${user.userName}}`}}));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllUser = (warehouse:string,page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllUser({ warehouseId:warehouse, page }));

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