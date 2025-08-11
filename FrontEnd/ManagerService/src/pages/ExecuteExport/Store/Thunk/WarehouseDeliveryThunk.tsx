import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {
    setAddDeliveryItem,
    setUpdateDelivery,
    WarehouseDeliveryRequest
} from "@/pages/ExecuteExport/Store/WarehouseDeliverySlice.tsx";
import {setExpiringError} from "@/Store/InventoryOverView.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import { initTotalPage,setDeliveries } from "../WarehouseDeliverySlice.tsx";

export const AddDeliveryWarehouseForOrder = createAsyncThunk(
    "warehouseDelivery/AddDeliveryWarehouseForOrder",
    async (
        { request }: {request: WarehouseDeliveryRequest},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.deliveryWarehouse(null).addReceipt,
            request,
            rejectWithValue
        )
);
export const GetAllDeliveryWarehouseByStatus = createAsyncThunk(
    "warehouseDelivery/GetAllDeliveryWarehouseByStatus",
    async (
        { status,warehouse,page }: {status: string|null,warehouse:string|null,page:pageApi},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.deliveryWarehouse(page).search().byWarehouseId(warehouse,status).byStatus,
            undefined,
            rejectWithValue
        )
);
export const GetAllDeliveryItemByDeliveryId = createAsyncThunk(
    "warehouseDelivery/GetAllDeliveryItemByDeliveryId",
    async (
        { deliveryId }: {deliveryId: string},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.deliveryWarehouse(null).search().byDeliveryId(deliveryId).getAll,
            undefined,
            rejectWithValue
        )
);
export const UpdateDeliveryWarehouseComplete = createAsyncThunk(
    "warehouseDelivery/UpdateDeliveryWarehouseComplete",
    async (
        { deliveryId }: {deliveryId:string},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.deliveryWarehouse(null).updateComplete(deliveryId),
            undefined,
            rejectWithValue
        )
);
export const MiddleGetAllWarehouseDeliveryByStatus = (warehouse:string|null, status:string|null, page:pageApi) => {
    return async function (dispatch: any) {
        try {
            console.log(warehouse)
            const action=await dispatch(GetAllDeliveryWarehouseByStatus({status,warehouse,page}))
            dispatch(setDeliveries(action?.payload?.result?.content));
            dispatch(initTotalPage(action?.payload?.result?.totalPages));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllDeliveryItemByDeliveryId = (deliveryId:string) => {
    return async function (dispatch: any) {
        try {
            const action=await dispatch(GetAllDeliveryItemByDeliveryId({deliveryId}))
            console.log(action.payload?.result);
            dispatch(setAddDeliveryItem(action?.payload?.result));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleUpdateWarehouseDelivery = (deliveryId:string) => {
    return async function (dispatch: any) {
        try {
            const action=await dispatch(UpdateDeliveryWarehouseComplete({deliveryId}))
            dispatch(setUpdateDelivery(action?.payload?.result));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};