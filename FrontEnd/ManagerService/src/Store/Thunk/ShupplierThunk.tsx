import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {setAddSupplier, setSupplierList, SupplierCreate} from "@/Store/SupplierSlice.tsx";
import {initToTalPage} from "@/Store/Unit.tsx";

export const AddSupplier = createAsyncThunk(
    "Supplier/AddSupplier",
    async (
        { payload }: { payload: SupplierCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.user.supplier(null).addSupplier,
            payload,
            rejectWithValue
        )
);
export const MiddleAddSupplier = (SupplierCreate:SupplierCreate) => {
    return async function (dispatch: any,getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(AddSupplier({ payload:{...SupplierCreate,warehouses:warehouseId} }));
            dispatch(setAddSupplier(action.payload.result));
            showToast({
                title: "Add New",
                description: `Message: Add New Supplier ${SupplierCreate.supplierName} Successfully`,
                color: "Success",
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
export const GetAllSupplierByIdWarehouse = createAsyncThunk(
    "Supplier/GetAllSupplierByIdSupplierGroup",
    async (
        { page,warehouseId }: { page: pageApi,warehouseId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.supplier(page).search().byWarehouseId(warehouseId).getAll,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllSupplier = (page: pageApi) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllSupplierByIdWarehouse({ page,warehouseId }));
            dispatch(setSupplierList(action.payload.result.content));
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