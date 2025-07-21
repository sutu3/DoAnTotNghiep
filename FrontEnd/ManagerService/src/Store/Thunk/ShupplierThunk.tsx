import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
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
    return async function (dispatch: any) {
        try {
            const action = await dispatch(AddSupplier({ payload:{...SupplierCreate} }));
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
export const GetAllSupplierPageByIdWarehouse = createAsyncThunk(
    "Supplier/GetAllSupplierPageByIdWarehouse",
    async (
        { page}: { page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.supplier(page).search().byWarehouseId().getAll,
            undefined,
            rejectWithValue
        )
);

export const GetAllSupplierListByIdWarehouse = createAsyncThunk(
    "Supplier/GetAllSupplierListByIdWarehouse",
    async (
        _: { },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.user.supplier(null).search().byWarehouseId().getAllName,
            undefined,
            rejectWithValue
        )
);
export const MiddleGetAllSupplierList = () => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllSupplierListByIdWarehouse({ warehouseId }));
            dispatch(setSupplierList(action.payload.result));

        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllSupplierPage = (page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllSupplierPageByIdWarehouse({ page }));
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