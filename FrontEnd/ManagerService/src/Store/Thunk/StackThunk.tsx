import {setAddStack, setStackList, StackCreate,initToTalPage} from "@/Store/StackSlice.tsx";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const addStack = createAsyncThunk(
    "stack/addStack",
    async (payload: StackCreate, { rejectWithValue }) =>
        await callApiThunk("POST", API_ROUTES
            .warehouse
            .stacks(null)
            .addStacks, payload, rejectWithValue)
);

export const GetAllStack = createAsyncThunk(
    "stack/getAllStack",
    async (
        { warehouseId, page }: { warehouseId: string; page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES
                .warehouse
                .stacks(page)
                .search
                .byWarehouseId( warehouseId)
                .getAll,
            undefined,
            rejectWithValue
        )
);
export const GetAllStackList = createAsyncThunk(
    "stack/GetAllStackList",
    async (
        { warehouseId }: { warehouseId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES
                .warehouse
                .stacks(null)
                .search
                .byWarehouseId( warehouseId)
                .getAllList,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllStack = (page: pageApi) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllStack({ warehouseId, page }));
            dispatch(setStackList(action.payload.result.content));
            dispatch(initToTalPage(action.payload.result.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllStackList = () => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const action = await dispatch(GetAllStackList({ warehouseId }));
            dispatch(setStackList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleAddStack = (payload: StackCreate) => {
    return async function check(dispatch: any, getState: any) {
        try {
            const { warehouse } = getState().warehouse;

            // Kiểm tra kỹ slice "warehouse" trong root reducer của bạn có field này không
            const action=await dispatch(addStack({ ...payload, warehouse: warehouse.warehouseId }));
            dispatch(setAddStack(action.payload.result));
            showToast({
                title: "Add New",
                description: `Message: Add New Stack ${payload.stackName} Successfully`,
                color: "Success",
            });
        } catch (error) {
            showToast({
                title: "Error",
                description: `Message :${error}`,
                color: "danger",
            });
        }
    };
};