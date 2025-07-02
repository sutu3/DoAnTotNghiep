import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initToTalPage, setProductList} from "@/Store/ProductSlice.tsx";

// export const AddProduct = createAsyncThunk(
//     "product/AddProduct",
//     async (
//         { payload }: { payload: SupplierCreate },
//         { rejectWithValue }
//     ) =>
//         await callApiThunk(
//             "POST",
//             API_ROUTES.user.supplier(null).addSupplier,
//             payload,
//             rejectWithValue
//         )
// );
// export const MiddleAddSupplier = (SupplierCreate:SupplierCreate) => {
//     return async function (dispatch: any,getState: any) {
//         try {
//             const { warehouse } = getState().warehouse;
//             const warehouseId = warehouse?.warehouseId;
//             const action = await dispatch(AddSupplier({ payload:{...SupplierCreate,warehouses:warehouseId} }));
//             dispatch(setAddSupplier(action.payload.result));
//             showToast({
//                 title: "Add New",
//                 description: `Message: Add New Supplier ${SupplierCreate.supplierName} Successfully`,
//                 color: "Success",
//             });
//         } catch (error: any) {
//             showToast({
//                 title: "Error",
//                 description: `Message: ${error.message || error}`,
//                 color: "danger",
//             });
//         }
//     };
// };
export const GetAllProductIdWarehouse = createAsyncThunk(
    "product/GetAllProductIdWarehouse",
    async (
        { page,warehouseId }: { page: pageApi,warehouseId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.product(page).search().byWarehouseId(warehouseId).getAll,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllProduct = (page: pageApi) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllProductIdWarehouse({ page,warehouseId }));
            dispatch(setProductList(action.payload.result.content));
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