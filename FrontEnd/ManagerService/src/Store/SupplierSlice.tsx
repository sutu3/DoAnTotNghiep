import {createSlice} from "@reduxjs/toolkit";
export const columns = [
    { name: "Supplier Name", uid: "supplierName", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Phone Number", uid: "phoneNumber", sortable: true },
    { name: "Address", uid: "address", sortable: false },
    { name: "Status", uid: "status", sortable: false },
    { name: "Create At", uid: "createdAt", sortable: false },
    {name:"Action", uid: "action", sortable: false },
];
export interface SupplierCreate {
    urlSupplier: string;
    supplierName: string;
    email: string;
    phoneNumber: string;
    address: string;
    district: string;
    street: string;
    country: string;
    warehouses: string;
}
export interface Supplier{
    supplierId: string,
    urlSupplier: string;
    supplierName: string;
    email: string;
    phoneNumber: string;
    address: string;
    district: string;
    street: string;
    country: string;
    status: string,
    createdAt:Date
}
export interface SupplierState{
    suppliers: Supplier[];
    totalPage: number,
}
const initialState:SupplierState= {
    suppliers:[],
    totalPage: 0,
}
const SupplierSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setSupplierList: (state, action) => {
            state.suppliers = action.payload;
        },
        setAddSupplier: (state, action) => {
            state.suppliers = [...state.suppliers, action.payload];
        }
    },
});
export const {setSupplierList, setAddSupplier} = SupplierSlice.actions;
export default SupplierSlice;

