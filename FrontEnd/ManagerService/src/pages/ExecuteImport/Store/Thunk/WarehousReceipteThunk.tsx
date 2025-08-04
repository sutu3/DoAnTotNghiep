import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {callApiThunk} from "@/Store/Store.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initTotalPage,
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
        { warehouseId,status,receiptId,page }: {warehouseId: string|null, status: string|null, receiptId: string|null,page:pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.receiptWarehouse(page).search().byWarehouseId(warehouseId,status,receiptId).getAll,
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
export const MiddleGetReceiptByWarehouseId = (
    warehouseId: string|null,
    status: string|null,
    receiptId: string|null,
    page:pageApi) => {
    return async function (dispatch: any) {
        try {
            console.log("Ma phieu"+ receiptId);
            const action = await dispatch(GetReceiptByWarehouseId({ warehouseId,status,receiptId,page }));
            dispatch(setReceiptWarehouseList(action.payload.result?.content));
            dispatch(initTotalPage(action.payload.result?.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};