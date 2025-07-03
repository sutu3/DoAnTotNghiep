import {setAddStack, setStackList, StackCreate, StackType} from "@/Store/StackSlice.tsx";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initToTalPage} from "@/Store/Unit.tsx";

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


export const mappedStack = (stackFromApi: StackType): StackType => {
    return {
        stackId: stackFromApi.stackId,
        stackName: stackFromApi.stackName,
        description: stackFromApi.description,
        bin: stackFromApi.bin,
    };
};

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