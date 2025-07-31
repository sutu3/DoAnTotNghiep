import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {User} from "@/types";
import {ExportOrder} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
export interface DeliveryItem {
    exportItemId: string;
    productName: string;
    sku: string;
    binLocation: string;
    binCode: string;
    deliveredQuantity: number;
    maxQuantity: number;
    unitPrice: number;
    unit: string;
    note?: string;
}

export interface WarehouseDeliveryRequest {
    exportOrderId: string;
    notes?: string;
    deliveryItems: DeliveryItemRequest[];
}
export interface DeliveryItemRequest {
    exportItemId: string;
    deliveredQuantity: number;
    binLocation: string;
    note?: string;
}

export interface WarehouseDeliveryResponse {
    deliveryId: string;
    exportOrderId: string;
    createdByUser: User;
    deliveryDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    notes?: string;
    warehouse: string;
    exportOrder:ExportOrder;
    deliveryItems: DeliveryItemResponse[];
}

export interface DeliveryItemResponse {
    deliveryItemId: string;
    deliveryId: string;
    exportItemId: string;
    deliveredQuantity: number;
    binLocation: string;
    deliveredAt: string;
    note?: string;
}
interface WarehouseDeliveryState {
    deliveries: WarehouseDeliveryResponse[];
    loading: boolean;
    error: string | null;
    totalPage: number;
}

const initialState: WarehouseDeliveryState = {
    deliveries: [],
    loading: false,
    error: null,
    totalPage:0
};
const WarehouseDeliverySlice = createSlice({
    name: "warehouseDelivery",
    initialState,
    reducers: {
        setDeliveries: (state, action: PayloadAction<WarehouseDeliveryResponse[]>) => {
            state.deliveries = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUpdateDelivery: (state, action) => {
            state.deliveries = state.deliveries.map((delivery) => {
                if (delivery.deliveryId === action.payload.deliveryId) {
                    return action.payload;
                }
                return delivery;
            });
        },
        setAddListDelivery: (state, action) => {
            state.deliveries= state.deliveries.length!=0?[...state.deliveries, action.payload]:action.payload;
        },
        initTotalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
    },
    extraReducers: (builder) => {
        builder

    }
});

export const {initTotalPage, setDeliveries, clearError,setAddListDelivery,setUpdateDelivery } = WarehouseDeliverySlice.actions;
export default WarehouseDeliverySlice;