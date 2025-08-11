import {createAsyncThunk} from "@reduxjs/toolkit";
import { callApiThunk } from "../Store";
import {
    calculateStats,
    setCapacityError,
    setCapacityLoading,
    setExpiringError,
    setExpiringLoading,
    setExpiringProducts,
    setLowStockError,
    setLowStockLoading,
    setLowStockProducts, setMovementsError, setMovementsLoading, setRecentMovements, setWarehouseCapacity
} from "@/Store/InventoryOverView.tsx";
import { showToast } from "@/components/UI/Toast/ToastUI";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {initTotalPage, InventoryProductCreate, setInventoryProductList} from "@/Store/InventoryWarehouseSlice.tsx";

export const GetLowStockProducts = createAsyncThunk(
    "inventory/getLowStock",
    async (_, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.products(null).lowStock,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetLowStockProducts = () => {
    return async function (dispatch: any) {
        try {
            dispatch(setLowStockLoading(true));
            const action = await dispatch(GetLowStockProducts());
            dispatch(setLowStockProducts(action.payload.result));
        } catch (error: any) {
            dispatch(setLowStockError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load low stock products: ${error.message}`,
                color: "danger",
            });
        }
    };
};

// Get Expiring Products
export const GetExpiringProducts = createAsyncThunk(
    "inventory/getExpiring",
    async ({ date }: { date: string }, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            `${API_ROUTES.inventory.InventoryWarehouse(null).expiring}?date=${date}`,
            undefined,
            rejectWithValue
        )
);
export const AddInventoryProduct = createAsyncThunk(
    "inventory/AddInventoryProduct",
    async (
        { payload,productId }: { payload: InventoryProductCreate[],productId:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.inventory.products(null).batch(productId),
            payload,
            rejectWithValue
        )
);

export const GetAllInventoryProduct = createAsyncThunk(
    "inventory/GetAllInventoryProduct",
    async (
        { warehouseId,page }: { warehouseId: string,page:pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.products(page).search.byWarehouse(warehouseId).getAll,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllInventoryProducts = (warehouseId: string,page:pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllInventoryProduct({ warehouseId,page }));
            dispatch(setInventoryProductList(action.payload.result?.content));
            dispatch(initTotalPage(action.payload.result?.totalPages));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load expiring products: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetExpiringProducts = (date: string) => {
    return async function (dispatch: any) {
        try {
            dispatch(setExpiringLoading(true));
            const action = await dispatch(GetExpiringProducts({ date }));
            dispatch(setExpiringProducts(action.payload.result));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load expiring products: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleAddLinkWarehouse = ( data: InventoryProductCreate[],productId:string ) => {
    return async function (dispatch: any) {
        try {
            await dispatch(AddInventoryProduct({ payload:data,productId }));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load expiring products: ${error.message}`,
                color: "danger",
            });
        }
    };
};
// Get Recent Movements
export const GetRecentMovements = createAsyncThunk(
    "inventory/getRecentMovements",
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            `${API_ROUTES.inventory.movements(null).dateRange}?startDate=${startDate}&endDate=${endDate}`,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetRecentMovements = (startDate: string, endDate: string) => {
    return async function (dispatch: any) {
        try {
            dispatch(setMovementsLoading(true));
            const action = await dispatch(GetRecentMovements({ startDate, endDate }));
            dispatch(setRecentMovements(action.payload.result));
        } catch (error: any) {
            dispatch(setMovementsError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load recent movements: ${error.message}`,
                color: "danger",
            });
        }
    };
};

// Get Warehouse Capacity
export const GetWarehouseCapacity = createAsyncThunk(
    "inventory/getCapacity",
    async ({ warehouseId }: { warehouseId: string }, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            API_ROUTES.inventory.stats.capacity(warehouseId),
            undefined,
            rejectWithValue
        )
);

export const MiddleGetWarehouseCapacity = (warehouseId: string) => {
    return async function (dispatch: any) {
        try {
            dispatch(setCapacityLoading(true));
            const action = await dispatch(GetWarehouseCapacity({ warehouseId }));
            dispatch(setWarehouseCapacity(action.payload.result));
        } catch (error: any) {
            dispatch(setCapacityError(error.message));
            showToast({
                title: "Error",
                description: `Failed to load warehouse capacity: ${error.message}`,
                color: "danger",
            });
        }
    };
};

// Load all inventory data
export const MiddleLoadAllInventoryData = (warehouseId: string) => {
    return async function (dispatch: any) {
        // Load low stock products
        dispatch(MiddleGetLowStockProducts());

        // Load expiring products (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dispatch(MiddleGetExpiringProducts(nextWeek.toISOString().split('T')[0]));

        // Load recent movements (last 7 days)
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        dispatch(MiddleGetRecentMovements(startDate, endDate));
        dispatch(calculateStats());
        // Load warehouse capacity
        dispatch(MiddleGetWarehouseCapacity(warehouseId));
    };
};