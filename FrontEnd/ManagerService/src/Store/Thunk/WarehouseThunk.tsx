import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {getUserRoleFromToken} from "@/Utils/auth.ts";
import WarehouseSlice, {setAllWarehouse, setWarehouse} from "@/Store/WarehouseSlice.tsx";
import {initToTalPage} from "@/Store/ProductSlice.tsx";

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
            console.log(role);
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