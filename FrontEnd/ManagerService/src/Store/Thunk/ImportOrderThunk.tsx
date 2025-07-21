import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {
    ImportItemCreate, ImportOrderItem,
    initToTalPage,
    OrderRequestImportCreate,
    setOrderImportItemList,
    setOrderImportList, setUpdateOrderImport
} from "@/Store/ImportOrder.tsx";
import {ImportOrderRequest, mapImportItemToRequest} from "@/Utils/mapImportItemToRequest .tsx";

export const AddItemOrderBatch = createAsyncThunk(
    "importOrder/AddItemOrderBatch",
    async (
        { payload }: { payload: ImportOrderRequest[]},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.orderItems(null).addOrderItemImportBatch,
            payload,
            rejectWithValue
        )
);
export const AddOrder = createAsyncThunk(
    "importOrder/AddOrder",
    async (
        { payload }: { payload: OrderRequestImportCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.importOrder(null).addOrderImport,
            payload,
            rejectWithValue
        )
);

export const MiddleAddOrderImport = (orderImport:OrderRequestImportCreate, items:ImportItemCreate[]) => {
    return async function (dispatch: any) {
        try {

            const note=`Staff: `+orderImport.note
            const action = await dispatch(
                AddOrder({ payload: {
                        ...orderImport,note:note
                    }
                }));
            const orderId=action.payload.result.importOrderId;
            const ListItem: ImportOrderRequest[] = items?.map((el) =>
                mapImportItemToRequest(el, orderImport.warehouse, orderId)
            );
            await dispatch(AddItemOrderBatch({ payload: ListItem }));
            showToast({
                title: "Add New",
                description: `Message: Add New Order Request Import Successfully`,
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
export const GetAllOrder = createAsyncThunk(
    "importOrder/GetAllOrder",
    async (
        { page,warehouseId }: {page:pageApi, warehouseId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.importOrder(page).search().byWarehouseId(warehouseId,null).getAll,
            null,
            rejectWithValue
        )
);
export const GetAllOrderItemByOrderId = createAsyncThunk(
    "importOrder/GetAllOrderItemByOrderId",
    async (
        { orderId }: { orderId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.orderItems(null).search().byOrderId(orderId).getAll,
            null,
            rejectWithValue
        )
);
export const AccessOrderItemByOrderId = createAsyncThunk(
    "importOrder/AccessOrderItemByOrderId",
    async (
        { orderId }: { orderId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.importOrder(null).changeStatus(orderId).approve,
            null,
            rejectWithValue
        )
);
export const RejectOrderItemByOrderId = createAsyncThunk(
    "importOrder/RejectOrderItemByOrderId",
    async (
        { orderId,note }: { orderId: string,note:string|null },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.importOrder(null).changeStatus(orderId).reject,
            {note:note},
            rejectWithValue
        )
);
export const ImportOrderItemForOrder = createAsyncThunk(
    "importOrder/ImportOrderItemForOrder",
    async (
        { orderId,items }: { orderId: string,items: ImportOrderItem[]},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.orderItems(null).AddItemForOrder(orderId).byOrderId,
            items,
            rejectWithValue
        )
);

export const GetAllOrderByStatus = createAsyncThunk(
    "importOrder/GetAllOrderByStatus",
    async (
        { page,warehouseId,status }: {page:pageApi, warehouseId: string,status:string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.importOrder(page).search().byWarehouseId(warehouseId,status).byStatus,
            null,
            rejectWithValue
        )
);
export const MiddleGetAllOrderItem = (orderId:string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllOrderItemByOrderId({ orderId }));
            dispatch(setOrderImportItemList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllImportOrderByStatus = (warehouse:string,status:string, page:pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllOrderByStatus({ page,warehouseId:warehouse,status }));
            const orderId=action?.payload?.result?.content[0]?.importOrderId
            if(orderId){
                const action2 = await dispatch(GetAllOrderItemByOrderId({ orderId }));
                dispatch(setOrderImportItemList(action2.payload.result));
            }
            dispatch(setOrderImportList(action.payload.result.content));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleChangeTypeOrderItem = (orderId:string,access:boolean,note:string|null) => {
    return async function (dispatch: any) {
        try {
            let action;
            if(access){
                action = await dispatch(AccessOrderItemByOrderId({ orderId }));
            }else{
                action = await dispatch(RejectOrderItemByOrderId({ orderId,note }));
            }
            dispatch(setUpdateOrderImport(action.payload.result));
            showToast({
                title: "Change Type",
                description: `Message: Change ${access?"Access":"Reject"} Import Order Successfully`,
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
export const MiddleImportOrder = (orderId: string, ListOrderItem: ImportOrderItem[]) => {
    return async function (dispatch: any) {
        try {
            console.log(ListOrderItem)
             await dispatch(ImportOrderItemForOrder({orderId,items:ListOrderItem}));

            // Final success notification
            showToast({
                title: "Import Complete",
                description: `Successfully imported ${ListOrderItem.length} items to warehouse`,
                color: "success",
            })

        } catch (error: any) {
            showToast({
                title: "Import Failed",
                description: `Import process failed: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllOrder = (page: pageApi) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllOrder({ page,warehouseId }));
            dispatch(setOrderImportList(action.payload.result.content));
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