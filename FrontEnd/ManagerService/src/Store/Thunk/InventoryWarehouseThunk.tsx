import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApiThunk } from "../Store";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {setInventoryWarehouseList} from "@/Store/InventoryWarehouseSlice.tsx";


export const GetInventoryWarehouseByBinId = createAsyncThunk(
    "inventoryWarehouse/GetInventoryWarehouseByBinId",
    async (
        {  binId }: { binId:string  },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.InventoryWarehouse(null).search().byBinId(binId).getBin,
            undefined,
            rejectWithValue
        )
);
export const GetAllInventoryWarehouseByProduct = createAsyncThunk(
    "inventoryWarehouse/GetAllInventoryWarehouseByProduct",
    async (
        { productId }: { productId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.InventoryWarehouse(null).search().byProductId(productId).getProduct,
            null,
            rejectWithValue
        )
);
export const GetAllInventoryWarehouseByWarehouse = createAsyncThunk(
    "inventoryWarehouse/GetAllInventoryWarehouseByWarehouse",
    async (
        { warehouse,page }: { warehouse: string,page:pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.InventoryWarehouse(page).search().byWarehouseId(warehouse).getWarehouse,
            null,
            rejectWithValue
        )
);

export const MiddleGetInventoryWarehouse = (binId:string) => {
    return async function (dispatch: any) {
         try {

            const action = await dispatch(GetInventoryWarehouseByBinId({  binId }));
            dispatch(setInventoryWarehouseList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetInventoryWarehouseByProductId = (productId:string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllInventoryWarehouseByProduct({  productId }));
            dispatch(setInventoryWarehouseList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetInventoryWarehouseByWarehouseId = (warehouse:string,page:pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllInventoryWarehouseByWarehouse({  warehouse,page }));
            dispatch(setInventoryWarehouseList(action.payload.result?.content));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};

