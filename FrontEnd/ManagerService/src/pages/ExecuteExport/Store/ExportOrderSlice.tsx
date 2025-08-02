import {createSlice} from "@reduxjs/toolkit";
import {User} from "@/types";
import {Product} from "@/Store/ProductSlice.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";
import {Unit} from "@/Store/Unit.tsx";
import {Bin} from "@/Store/StackSlice.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

export interface ExportItemCreateUI {
    itemId: string;
    product: string;
    productName: string;
    customer: string;
    customerName: string;
    unit: string;
    unitName: string;
    bin?: string;
    requestQuantity: number;
    unitPrice: number;
    note?: string;
    batchNumber?: string;
    maxQuantity?: number;
    sku?: string;
}
export interface ExportItemCreate {
    exportOrderId: string;
    product: string;
    unit: string;
    binLocation?: string;
    quantity: number;
    unitPrice: number;
    batchNumber?: string;
}

export interface ExportOrderItem {
    exportItemId: string;
    product: Product;
    customer?: Supplier;
    quantity: number;
    realityQuantity: number;
    unitPrice: number;
    unit: Unit;
    bin?: Bin;
    note?: string;
    batchNumber?: string;
}

export interface ExecuteExportItem extends ExportOrderItem {
    actualQuantity: number;
    checkedQuantity: number;
    selectedBin?: string;
    selectedStack?: string;
    status: 'pending' | 'checked' | 'exported';
}

export interface ExportOrder {
    exportOrderId: string;
    warehouse: Warehouse;
    createByUser: User;
    customer: Supplier;
    description: string;
    itemCount: number;
    totalAmount: number;
    status: "CREATED"|"APPROVED"|"PENDING_APPROVAL" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    type: "Request" | "Accept";
    requestDate: string;
    accessDate?: string;
    deliveryDate?: string;
    items: ExportOrderItem[];
    totalValue: number;
}

export interface OrderRequestExportCreate {
    warehouse: string;
    customer: string;
    description: string;
    deliveryDate?: string;
}

interface OrderExportState {
    orderExport: ExportOrder[];
    orderItem: ExportOrderItem[];
    exportItemCreate: ExportItemCreateUI[];
    executeExportItem: ExecuteExportItem[];
    totalPage: number;
}

const initialState: OrderExportState = {
    orderExport: [],
    orderItem: [],
    exportItemCreate: [],
    executeExportItem: [],
    totalPage: 0,
}

const OrderExportSlice = createSlice({
    name: "exportOrder",
    initialState,
    reducers: {
        initTotalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setOrderExportList: (state, action) => {
            state.orderExport = action.payload;
        },
        setRemoveOrderList: (state, action) => {
            state.orderExport = state.orderExport.filter((el=>el.exportOrderId!=action.payload));
        },
        setOrderExportItemList: (state, action) => {
            state.orderItem = action.payload;
        },
        setCleanItemOrderCreate: (state) => {
            state.exportItemCreate = [];
        },
        setAddItemOrderCreate: (state, action) => {
          state.exportItemCreate = [...state.exportItemCreate, action.payload];
        },
        setRemoveItemOrderCreate: (state, action) => {
            state.exportItemCreate =
                state.exportItemCreate.filter((_,index) =>index!=action.payload);
        },
        setAddItemOrderExport: (state, action) => {
            state.orderItem = [...state.orderItem, action.payload];
        },
        setExecuteExportItem: (state, action) => {
            state.executeExportItem = action.payload;
        },
        setRemoveOrderByOrderId: (state, action) => {
            state.orderExport =
            state.orderExport.filter((item) => item.exportOrderId != action.payload);
        },
        setUpdateOrderExportItem: (state, action) => {
            const updatedOrderItem: ExportOrderItem = action.payload;
            const index = state.orderItem.findIndex(el => el.exportItemId === updatedOrderItem.exportItemId);
            if (index !== -1) {
                state.orderItem[index] = updatedOrderItem;
            }
        }
    },
});

export const {
    initTotalPage,
    setRemoveOrderByOrderId,
    setExecuteExportItem,
    setOrderExportList,
    setCleanItemOrderCreate,
    setUpdateOrderExportItem,
    setOrderExportItemList,
    setAddItemOrderExport,
    setAddItemOrderCreate,
    setRemoveItemOrderCreate,
    setRemoveOrderList,
} = OrderExportSlice.actions;

export default OrderExportSlice;