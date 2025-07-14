import {callApiThunk} from "@/Store/Store.tsx";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {initTotalPage, setStockMovementList, StockMovementCreate} from "@/Store/StockMovementSlice.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const GetAllStockMovement = createAsyncThunk(
    "stockMovement/getAllStockMovement",
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            `${API_ROUTES.inventory.movements}?warehouseId=${warehouseId}&page=${page.pageNumber}&size=${page.pageSize}`,
            undefined,
            rejectWithValue
        )
);

export const AddStockMovement = createAsyncThunk(
    "stockMovement/addStockMovement",
    async (
        { payload }: { payload: StockMovementCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.inventory.movements(null).addMovement,
            payload,
            rejectWithValue
        )
);

export const MiddleGetAllStockMovement = (page: pageApi) => {
    return async function (dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllStockMovement({ warehouseId, page }));

            dispatch(setStockMovementList(action.payload.result.content));
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

export const MiddleAddStockMovement = (stockMovementCreate: StockMovementCreate) => {
    return async function (dispatch: any, getState: any) {
        try {
            const { user } = getState().users;
            const userId = user?.userId;

            await dispatch(AddStockMovement({
                payload: { ...stockMovementCreate, performedBy: userId }
            }));

            showToast({
                title: "Success",
                description: "Stock movement created successfully",
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