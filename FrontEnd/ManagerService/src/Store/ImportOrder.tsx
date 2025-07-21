import {createSlice} from "@reduxjs/toolkit";
import {User} from "@/types";
import {Product} from "@/Store/ProductSlice.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";
import {Unit} from "@/Store/Unit.tsx";
import {Bin} from "@/Store/StackSlice.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

export interface ImportItemCreate {
    itemId: string;
    product: string;
    productName: string;
    supplier: string;
    supplierName: string;
    unit: string;
    unitName: string;
    bin?: string;
    requestQuantity: number;
    costUnitBase: number;
    note?: string;
    expiryDate?: string;

}
export interface ImportOrderItem {
    itemId: string;
    product: Product;
    supplier: Supplier;
    requestQuantity: number;
    realityQuantity: number;
    costUnitBase: number;
    unit: Unit;
    bin?: Bin;
    note?: string;
    expiryDate?: string;
}

export interface ExecuteImportItem extends ImportOrderItem {
    actualQuantity: number;
    checkedQuantity: number;
    selectedBin?: string;
    selectedStack?: string;
    status: 'pending' | 'checked' | 'imported';
}
export interface ImportOrder {
    importOrderId: string;
    warehouse: Warehouse;
    createByUser: User;
    description: string;
    itemCount: number,
    totalPrice: number,
    status: "Created" | "InProgress" | "Completed" | "Cancel";
    type: "Request" | "Accept";
    requestDate: string;
    accessDate?: string;
    items: ImportOrderItem[];
    totalValue: number;
}
export interface OrderRequestImportCreate {
    warehouse: string;
    note: string;
}
interface OrderImportState{
    orderImport: ImportOrder[];
    orderItem:ImportOrderItem[],
    executeImportItem:ExecuteImportItem[],
    totalPage: number;
}
const initialState:OrderImportState = {
    orderImport:[],
    orderItem:[],
    executeImportItem:[],
    totalPage:0,
}
const OrderImportSlice = createSlice({
    name: "importOrder",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setOrderImportList: (state, action) => {
            state.orderImport = action.payload;
        },
        setOrderImportItemList: (state, action) => {
            state.orderItem = action.payload;
        },
        setAddItemOrderImport: (state, action) => {
            state.orderItem = [...state.orderItem, action.payload];
        },
        setExecuteImportItem: (state, action) => {
            state.executeImportItem = action.payload;
        },
        setRemoveOrderByOrderId: (state, action) => {
            state.orderImport =
            state.orderImport.filter((item) => item.importOrderId != action.payload);
        },
        setUpdateOrderImport: (state, action) => {
            const updatedOrder: ImportOrder = action.payload;
            const index = state.orderImport.findIndex(el => el.importOrderId === updatedOrder.importOrderId);
            if (index !== -1) {
                state.orderImport[index] = updatedOrder;
            }
        }

    },
});
export const {initToTalPage,setRemoveOrderByOrderId,setExecuteImportItem,setOrderImportList,setUpdateOrderImport, setOrderImportItemList,setAddItemOrderImport} = OrderImportSlice.actions;
export default OrderImportSlice;