import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import OrderExportSlice, {
    ExportItemCreate, ExportItemCreateUI,
    ExportOrder, ExportOrderItem,
    OrderRequestExportCreate,
} from "@/Store/ExportOrderSlice.tsx";
import {setExpiringError} from "@/Store/InventoryOverView.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {mapExportOrderItemsToCreateList} from "@/Utils/mapExportItemToRequest.tsx";

export const AddOrderExport = createAsyncThunk(
    "exportOrder/AddOrderExport",
    async ({ order }: { order: OrderRequestExportCreate }, { rejectWithValue }) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.exportOrder(null).addOrder,
            order,
            rejectWithValue
        )
);
export const AddOrderExportItem = createAsyncThunk(
    "exportOrder/AddOrderExportItem",
    async ({ items }: { items: ExportItemCreate[] }, { rejectWithValue }) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.exportOrderItem(null).addOrderItemExportBatch,
            items,
            rejectWithValue
        )
);

export const GetPendingExportOrders = createAsyncThunk(
    "exportOrder/GetPendingExportOrders",
    async ({warehouse,page}:{warehouse:string,page:pageApi}, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.exportOrder(page).search().byWarehouseId(warehouse).getAllOrdersByStatusPendingAndApprove,
            null,
            rejectWithValue
        )
);
export const GetExportOrdersByStatus = createAsyncThunk(
    "exportOrder/GetExportOrdersByStatus",
    async ({status,warehouseId,page}:{status:string,warehouseId:string,page:pageApi}, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.exportOrder(page).search().ByStatus(status).getByWarehouse(warehouseId),
            null,
            rejectWithValue
        )
);
export const GetItemsByOrderId = createAsyncThunk(
    "exportOrder/GetItemsByOrderId",
    async ({orderId}:{orderId:string}, { rejectWithValue }) =>
        await callApiThunk(
            "GET",
            API_ROUTES.order.exportOrderItem(null).search().ByOrderId(orderId),
            null,
            rejectWithValue
        )
);
export const ApproveExportOrder = createAsyncThunk(
    "exportOrder/ApproveExportOrder",
    async (
        { orderId }: { orderId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.exportOrder(null).changeStatus(orderId).approved,
             null ,
            rejectWithValue
        )
);
export const UpdateStatus = createAsyncThunk(
    "exportOrder/UpdateStatus",
    async (
        { orderId }: { orderId: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.exportOrder(null).changeStatus(orderId).status,
            {status: "PENDING_APPROVAL"} ,
            rejectWithValue
        )
);
export const ExportOrderItemForOrder = createAsyncThunk(
    "exportOrder/ExportOrderItemForOrder",
    async (
        { orderId,items }: { orderId: string,items: ExportItemCreate[]},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.exportOrderItem(null).AddItemForOrder(orderId).byOrderId,
            items,
            rejectWithValue
        )
);
export const RejectExportOrder = createAsyncThunk(
    "exportOrder/RejectExportOrder",
    async (
        { orderId }: { orderId: string},
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.exportOrder(null).changeStatus(orderId).reject,
            null,
            rejectWithValue
        )
);
export const MiddleGetOrderItem = (orderId:string) => {
    return async function (dispatch: any) {
        try {

            const action=await dispatch(GetItemsByOrderId({orderId}))
            dispatch(OrderExportSlice.actions.setOrderExportItemList(action?.payload?.result));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleExportOrder = (orderId: string, ListOrderItem: ExportOrderItem[]) => {
    return async function (dispatch: any) {
        try {

            const convertItem=mapExportOrderItemsToCreateList(ListOrderItem,orderId)
            await dispatch(ExportOrderItemForOrder({orderId,items:convertItem}));

            // Final success notification
            showToast({
                title: "Import Complete",
                description: `Successfully exported ${ListOrderItem.length} items form warehouse`,
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
export const MiddleGetAllExportOrderByStatus = ( status:string, page:pageApi) => {
    return async function (dispatch: any,getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action=await dispatch(GetExportOrdersByStatus({status,warehouseId,page}))
            dispatch(OrderExportSlice.actions.setOrderExportList(action?.payload?.result?.content));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};

export const MiddleGetOrderExportPending_Approve = (page:pageApi) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action=await dispatch(GetPendingExportOrders({warehouse:warehouseId,page}))
            console.log(action?.payload?.result?.content)
            dispatch(OrderExportSlice.actions.setOrderExportList(action?.payload?.result?.content));
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};
export const MiddleAddOrderExport = (order: OrderRequestExportCreate,items:ExportItemCreateUI[]) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const {user}= getState().users;
            const userId= user?.userId;
            const action=await dispatch(AddOrderExport(
                {order:{...order,
                        warehouse:warehouseId,
                        createByUser:userId,}}));

            const Order:ExportOrder=action?.payload?.result;
            console.log(Order);
            const itemsUpdate:ExportItemCreate[] = items.map((el: ExportItemCreateUI) => ({
                    exportOrderId: Order.exportOrderId,
                    product: el.product,
                    unit: el.unit,
                    binLocation: el.bin,
                    quantity: el.requestQuantity,
                    unitPrice: el.unitPrice,
                    batchNumber:el.batchNumber,
                }
              ));
            await dispatch(AddOrderExportItem({items:itemsUpdate}));
            await dispatch(UpdateStatus( {orderId:Order.exportOrderId} ));
            showToast({
                title: "Add OrderExport Success",
                description: `Successfully added ${items.length} order items.`,
                color: "Success",
            });
        } catch (error: any) {
            dispatch(setExpiringError(error.message));
            showToast({
                title: "Error",
                description: `Failed to add Order: ${error.message}`,
                color: "danger",
            });
        }
    };
};
