import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {
    ImportItemCreate, ImportOrderItem,
    initToTalPage,
    OrderRequestImportCreate,
    setOrderImportItemList,
    setOrderImportList, setRemoveOrderByOrderId, setUpdateOrderImport
} from "@/Store/ImportOrder.tsx";
import {ImportOrderRequest, mapImportItemToRequest} from "@/Utils/mapImportItemToRequest .tsx";
import {InventoryWarehouseCreate} from "@/Store/InventoryWarehouseSlice.tsx";
import {AddInventoryWarehouse} from "@/Store/Thunk/InventoryWarehouseThunk.tsx";
import {StockMovement, StockMovementCreate} from "@/Store/StockMovementSlice.tsx";
import {AddStockMovement} from "@/Store/Thunk/StockMovementThunk.tsx";

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

export const MiddleAddOrder = (orderImport:OrderRequestImportCreate, items:ImportItemCreate[]) => {
    return async function (dispatch: any,getState: any) {
        try {

            const {user}= getState().users;
            const userId= user?.userId;
            const note=`Staff: `+orderImport.note
            const action = await dispatch(
                AddOrder({ payload: {
                        ...orderImport, createByUser: userId,note:note
                    }
                }));
            const orderId=action.payload.result.importOrderId;
            const ListItem: ImportOrderRequest[] = items?.map((el) =>
                mapImportItemToRequest(el, orderImport.warehouse, orderId, userId)
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
export const ChangeStatusOrderItemByOrderId = createAsyncThunk(
    "importOrder/ChangeStatusOrderItemByOrderId",
    async (
        { orderId,status }: { orderId: string,status:string|null },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.importOrder(null).changeStatus(orderId).ChangeStatus,
            {status:status},
            rejectWithValue
        )
);
export const ChangeQuantityOrderItemByOrderId = createAsyncThunk(
    "importOrder/ChangeStatusOrderItemByOrderId",
    async (
        { orderId,realityQuantity }: { orderId: string,realityQuantity:number },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.orderItems(null).updateItem(orderId).byQuantity,
            {realityQuantity:realityQuantity},
            rejectWithValue
        )
);
export const ChangeBinOrderItemByOrderId = createAsyncThunk(
    "importOrder/ChangeBinOrderItemByOrderId",
    async (
        { orderId,bin }: { orderId: string,bin:string|undefined },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.order.orderItems(null).updateItem(orderId).byBin,
            {binId:bin},
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
            API_ROUTES.order.importOrder(page).search().byWarehouseId(warehouseId,status).getAll,
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
export const MiddleGetAllOrderByStatus = (status:string,page:pageApi) => {
    return async function (dispatch: any,getState: any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const action = await dispatch(GetAllOrderByStatus({ page,warehouseId,status }));
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
export const MiddleImportOrder = (orderId:string,ListOrderItem:ImportOrderItem[]) => {
    return async function (dispatch: any,getState:any) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;
            const {user}= getState().user;
            const userId= user?.userId;
            await dispatch(ChangeStatusOrderItemByOrderId({status: "Done", orderId }));
            dispatch(setRemoveOrderByOrderId(orderId));

            for (const el of ListOrderItem) {
                await dispatch(ChangeQuantityOrderItemByOrderId({ orderId, realityQuantity: el.realityQuantity }));
                await dispatch(ChangeBinOrderItemByOrderId({ orderId, bin: el.bin?.binId }));
                const baseInventoryWarehouse: InventoryWarehouseCreate = {
                    product: el.product.productId,
                    bin: el?.bin?.binId,
                    quantity: el.realityQuantity,
                    expiryDate: el.expiryDate,
                    warehouse: warehouseId,
                    status: "AVAILABLE",
                };
                const action=await dispatch(AddInventoryWarehouse({payload:baseInventoryWarehouse }));
                const baseInventoryMovement: StockMovementCreate = {
                    inventoryWarehouseId: action.payload.result.inventoryWarehouseId,
                    product: el.product.productId,
                    movementType: "IMPORT",
                    quantity: el.realityQuantity,
                    referenceOrderId: orderId,
                    performedBy: userId,
                    note: "",
                    unitCost: el.costUnitBase
                };
                await dispatch(AddStockMovement({payload:baseInventoryMovement }));
            }
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
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