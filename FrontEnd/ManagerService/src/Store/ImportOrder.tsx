import {createSlice} from "@reduxjs/toolkit";

export interface ImportItem {
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

export interface OrderRequestImport {
    warehouse: string;
    createByUser: string;
    description: string;
    items: ImportItem[];
}
interface OrderImportState{
    orderImport: OrderRequestImport[];
    orderItem:ImportItem[],
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