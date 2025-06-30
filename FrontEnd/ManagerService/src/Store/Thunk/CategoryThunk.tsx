import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {setCategoryList, initToTalPage, CategoryCreate, setAddCategory} from "@/Store/CategorySlice.tsx";

export const AddCategory = createAsyncThunk(
    "category/AddCategory",
    async (
        { payload }: { payload:CategoryCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.product.category(null).addCategory,
            payload,
            rejectWithValue
        )
);
export const GetAllCategory = createAsyncThunk(
    "category/GetAllCategory",
    async (
        { page,warehouseId }: { page: pageApi,warehouseId:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.category(page).search().byWarehouseId(warehouseId).getAll,
            undefined,
            rejectWithValue
        )
);
export const MiddleAddCategory = (payload:CategoryCreate) => {
    return async function (dispatch: any,getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const { user } = getState().users;
            const userId = user?.userId;
            console.log(user);
            const action = await dispatch(AddCategory(
                { payload:{...payload,warehouses:warehouseId,createByUser:userId} }));

            dispatch(setAddCategory(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllCategory = (page: pageApi) => {
    return async function (dispatch: any,getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllCategory({ page,warehouseId }));
            dispatch(setCategoryList(action.payload.result.content));
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