import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApiThunk } from "../Store";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
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
            API_ROUTES.inventory.InventoryWarehouse().search().byBinId(binId).getProduct,
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
            API_ROUTES.inventory.InventoryWarehouse().search().byProductId(productId).getProduct,
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

