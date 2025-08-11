import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
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
        { page }: { page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.category(page).search().byWarehouseId().getAll,
            undefined,
            rejectWithValue
        )
);
export const GetAllCategoryList = createAsyncThunk(
    "category/GetAllCategoryList",
    async (
        _: { },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.category(null).search().byWarehouseId().getAllName,
            undefined,
            rejectWithValue
        )
);
export const MiddleAddCategory = (payload:CategoryCreate) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(AddCategory(
                { payload:payload }));

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
export const MiddleGetAllCategory = (page: pageApi|null) => {
    return async function (dispatch: any) {
        try {
            if( page === null) {
                const action = await dispatch(GetAllCategoryList({}));
                dispatch(setCategoryList(action.payload.result));
            }else{
                const action = await dispatch(GetAllCategory({ page }));
                dispatch(setCategoryList(action.payload.result.content));
                dispatch(initToTalPage(action.payload.result.totalPages));
            }

        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};