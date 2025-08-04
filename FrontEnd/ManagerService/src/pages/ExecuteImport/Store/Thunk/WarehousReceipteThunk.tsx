import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {
    ReceiptItemCreate,
    ReceiptWarehouseCreate, setAddReceiptList,
    setReceiptWarehouseList
} from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";

export const GetReceiptById = createAsyncThunk(
    "warehousReceiptSlice/GetReceiptById",
    async (
        { receiptId }: {receiptId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.receiptWarehouse(null).search().byWarehouseReceipts(receiptId),
            null,
            rejectWithValue
        )
);

export const GetReceiptByWarehouseId = createAsyncThunk(
    "warehousReceiptSlice/GetReceiptByWarehouseId",
    async (
        { warehouseId }: {warehouseId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.receiptWarehouse(null).search().byWarehouseId(warehouseId),
            null,
            rejectWithValue
        )
);
export const AddReceipt = createAsyncThunk(
    "warehousReceiptSlice/AddReceipt",
    async (
        { payload }: {payload: ReceiptWarehouseCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.receiptWarehouse(null).addReceipt,
            payload,
            rejectWithValue
        )
);
export const syncWithBackend = createAsyncThunk(
    "warehousReceiptSlice/syncWithBackend",
    async (
        { receiptId,receiptItemId,request }: {receiptId: string, receiptItemId: string,request:ReceiptItemCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.receiptWarehouse(null).updateItem(receiptId,receiptItemId),
            request,
            rejectWithValue
        )
);
export const UpdateReceiptComplete = createAsyncThunk(
    "warehousReceiptSlice/UpdateReceiptComplete",
    async (
        { receiptId }: {receiptId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.receiptWarehouse(null).updateComplete(receiptId),
            undefined,
            rejectWithValue
        )
);
export const MiddleGetReceiptItemByWarehouseReceiptId = (receiptId:string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetReceiptById({ receiptId }));
            dispatch(setAddReceiptList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetReceiptByWarehouseId = (warehouseId:string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetReceiptByWarehouseId({ warehouseId }));
            dispatch(setReceiptWarehouseList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};