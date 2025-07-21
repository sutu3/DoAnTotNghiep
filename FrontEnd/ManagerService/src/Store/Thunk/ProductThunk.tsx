import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initToTalPage, setAddProduct, setProductList} from "@/Store/ProductSlice.tsx";
import {ProductCreate} from "@/zustand/Product.tsx";

export const AddProduct = createAsyncThunk(
    "product/AddProduct",
    async (
        { payload,list }: { payload: ProductCreate,list:string[] },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.product.product(null).addProduct,
            {productRequest:payload,idWarehouses:list},
            rejectWithValue
        )
);
export const GetAllProductBySearch = createAsyncThunk(
    "product/GetAllProductBySearch",
    async (
        { warehouseId,supplierId }: { warehouseId: string|null,supplierId: string|null },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.product(null).search().bySupplierAndWarehouse(warehouseId, supplierId).getAll,
            null,
            rejectWithValue
        )
);
export const MiddleAddProduct = (productCreate:ProductCreate,warehouseList:string[]) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(
                AddProduct({ payload:productCreate,list:warehouseList
                }));
            dispatch(setAddProduct(action.payload.result));
            showToast({
                title: "Add New",
                description: `Message: Add New Product ${productCreate.productName} Successfully`,
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
export const GetAllProductIdWarehouse = createAsyncThunk(
    "product/GetAllProductIdWarehouse",
    async (
        { page}: { page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.product(page).search().byWarehouseId().getAll,
            undefined,
            rejectWithValue
        )
);
export const MiddleGetAllProductBySearch = (supplierId:string|null,warehouseId:string|null) => {
    return async function (dispatch: any) {
        try {

            const action = await dispatch(GetAllProductBySearch({ warehouseId,supplierId }));
            dispatch(setProductList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllProduct = (page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllProductIdWarehouse({ page }));
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