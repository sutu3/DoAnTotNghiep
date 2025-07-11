import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApiThunk } from "../Store";
import {initTotalPage, InventoryWarehouseCreate, setInventoryWarehouseList} from "@/Store/InventoryWarehouseSlice.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const GetAllInventoryWarehouse = createAsyncThunk(
    "inventoryWarehouse/getAllInventoryWarehouse",
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.InventoryWarehouse(page).addInventoryWarehouse,
            undefined,
            rejectWithValue
        )
);

export const AddInventoryWarehouse = createAsyncThunk(
    "inventoryWarehouse/addInventoryWarehouse",
    async (
        { payload }: { payload: InventoryWarehouseCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.inventory.InventoryWarehouse(null).addInventoryWarehouse,
            payload,
            rejectWithValue
        )
);

export const MiddleGetAllInventoryWarehouse = (page: pageApi) => {
    return async function (dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllInventoryWarehouse({ warehouseId, page }));

            dispatch(setInventoryWarehouseList(action.payload.result.content));
            dispatch(initTotalPage(action.payload.result.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};

export const MiddleAddInventoryWarehouse = (inventoryWarehouseCreate: InventoryWarehouseCreate) => {
    return async function (dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            await dispatch(AddInventoryWarehouse({
                payload: { ...inventoryWarehouseCreate, warehouse: warehouseId }
            }));

            showToast({
                title: "Success",
                description: "Inventory warehouse created successfully",
                color: "success",
            });
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};