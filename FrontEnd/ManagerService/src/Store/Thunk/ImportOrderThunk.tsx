import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES} from "@/Constants/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {ImportItem, OrderRequestImport} from "@/Store/ImportOrder.tsx";
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
        { payload }: { payload: OrderRequestImport },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.order.importOrder(null).addOrderImport,
            payload,
            rejectWithValue
        )
);
export const MiddleAddOrder = (orderImport:OrderRequestImport,items:ImportItem[]) => {
    return async function (dispatch: any,getState: any) {
        try {

            const {user}= getState().users;
            const userId= user?.userId;
            const action = await dispatch(
                AddOrder({ payload: {
                        ...orderImport, createByUser: userId,
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