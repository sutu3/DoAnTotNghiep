import {createSlice} from "@reduxjs/toolkit";
import {User} from "@/types";

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
    productName: string;
    supplierName: string;
    requestQuantity: number;
    costUnitBase: number;
    unitName: string;
    note?: string;
    expiryDate?: string;
}
export interface ImportOrder {
    importOrderId: string;
    warehouse: string;
    createByUser: User;
    description: string;
    status: "Created" | "InProgress" | "Completed" | "Cancel";
    type: "Request" | "Accept";
    requestDate: string;
    accessDate?: string;
    items: ImportOrderItem[];
    totalValue: number;
}
export interface OrderRequestImportCreate {
    warehouse: string;
    createByUser: string;
    description: string;
}
interface OrderImportState{
    orderImport: ImportOrder[];
    orderItem:ImportItemCreate[],
    totalPage: number;
}
const initialState:OrderImportState = {
    orderImport:[],
    orderItem:[],
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
        }
    },
});
export const {initToTalPage,setOrderImportList, setOrderImportItemList,setAddItemOrderImport} = OrderImportSlice.actions;
export default OrderImportSlice;