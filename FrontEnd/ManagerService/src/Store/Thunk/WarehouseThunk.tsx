import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {getUserRoleFromToken} from "@/Utils/auth.ts";
import {setAllWarehouse, setUpdateWarehouse, setWarehouse, WarehouseCreate} from "@/Store/WarehouseSlice.tsx";

export const GetAllWarehouse = createAsyncThunk(
    "warehouse/GetAllWarehouse",
    async (
        { page }:  {page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.warehouse.warehouses(page).search.getAll,
            undefined,
            rejectWithValue
        )
);
export const AddWarehouse = createAsyncThunk(
    "warehouse/AddWarehouse",
    async (
        { payload }:  {payload: WarehouseCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.warehouse.warehouses(null).addWarehouse,
            payload,
            rejectWithValue
        )
);
export const GetAllWarehouseList = createAsyncThunk(
    "warehouse/GetAllWarehouseList",
    async ({page}:{page:pageApi}, { rejectWithValue })  =>
        await callApiThunk(
            "GET",
            API_ROUTES.warehouse.warehouses(page).GetAllList,
            undefined,
            rejectWithValue
        )
);
export const GetWarehouseByStaff = createAsyncThunk(
    "warehouse/GetWarehouseByStaff",
    async (_,
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.warehouse.warehouses(null).search.getByStaff,
            undefined,
            rejectWithValue
        )
);
export const MiddleGetWarehouseByUser = (page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const role =await getUserRoleFromToken();
            if( role=="manager"){
                const action=await dispatch(GetAllWarehouseList({page}))
                dispatch(setAllWarehouse(action.payload.result));
            }else{
                const action=await dispatch(GetWarehouseByStaff())
                dispatch(setAllWarehouse([action.payload.result]));
                dispatch(setWarehouse(action.payload.result));
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
export const MiddleAddWarehouse = (payload: WarehouseCreate) => {
    return async function (dispatch: any) {
        try {

                const action=await dispatch(AddWarehouse({payload}))
                dispatch(setUpdateWarehouse(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};