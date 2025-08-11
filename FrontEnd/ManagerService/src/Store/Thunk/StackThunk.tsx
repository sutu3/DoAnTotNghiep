import {setAddStack, setStackList, StackCreate,initToTalPage} from "@/Store/StackSlice.tsx";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const addStack = createAsyncThunk(
    "stack/addStack",
    async (payload: StackCreate, { rejectWithValue }) =>
        await callApiThunk("POST", API_ROUTES
            .warehouse
            .stacks(null)
            .addStacks, payload, rejectWithValue)
);
export const updateStack = createAsyncThunk(
    "stack/updateStack",
    async ({stackName,description,stackId}: {stackName:string,description:string,stackId:string}, { rejectWithValue }) =>
        await callApiThunk("PUT", API_ROUTES
            .warehouse
            .stacks(null)
            .updateStacks(stackId),
            {stackName: stackName,
            description: description
            }, rejectWithValue)
);
export const GetAllStack = createAsyncThunk(
    "stack/getAllStack",
    async (
        { warehouseId,stackName, page }: { warehouseId: string|null,stackName:string|null, page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES
                .warehouse
                .stacks(page)
                .search()
                .Filter( warehouseId,stackName)
                .getAll,
            undefined,
            rejectWithValue
        )
);
export const GetStats = createAsyncThunk(
    "stack/GetStats",
    async (
        { warehouse,taskType }: { warehouseId: string|null,stackName:string|null},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.tasks(null).search().byTaskTypeNameAndWarehouse(warehouse,taskType).getStats,
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
                .search()
                .byWarehouseId( warehouseId)
                .getAllList,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllStack = (page: pageApi,warehouse:string|null,stackName:string|null) => {
    return async function check(dispatch: any) {
        try {

            const action = await dispatch(GetAllStack({ warehouseId:warehouse,stackName, page }));
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
export const MiddleGetAllStackList = (warehouse:string) => {
    return async function check(dispatch: any) {
        try {
            const action = await dispatch(GetAllStackList({ warehouseId:warehouse }));
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
    return async function check(dispatch: any) {
        try {

            // Kiểm tra kỹ slice "warehouse" trong root reducer của bạn có field này không
            const action=await dispatch(addStack( payload ));
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