import {createSlice} from "@reduxjs/toolkit";
import {Category} from "@/Store/CategorySlice.tsx";
import {Unit} from "@/Store/Unit.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";
import {User} from "@/Store/UserSlice.tsx";


export const columns = [
    { name: "Category Name", uid: "productName", sortable: true },
    { name: "Sku", uid: "sku", sortable: true },
    { name: "description", uid: "description", sortable: true },
    { name: "Price", uid: "price", sortable: true },
    { name: "Supplier", uid: "supplier", sortable: true },
    { name: "Warehouses", uid: "warehouse", sortable: true },
    { name: "Active", uid: "isActive", sortable: true },
    { name: "Category", uid: "category", sortable: true },
    { name: "Unit", uid: "unit", sortable: true },
    { name: "Create At", uid: "createdAt", sortable: false },
    { name: "Action", uid: "action", sortable: true },
];

export interface Product {
    productId: string;
    productName: string;
    sku: string;
    description: string;
    urlImageProduct: string;
    price: number;
    supplier: Supplier;
    warehouses: Warehouse;
    createByUser: User;
    isActive: boolean;
    category: Category;
    unit: Unit;
    createdAt: Date;
    updatedAt: Date;
}
interface ProductState{
    products: Product[];
    totalPage: number;
}
const initialState:ProductState = {
    products:[],
    totalPage:0,
}
const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setProductList: (state, action) => {
            state.products = action.payload;
        },
        setAddProduct: (state, action) => {
            state.products = [...state.products, action.payload];
        }
    },
});
export const {initToTalPage,setProductList, setAddProduct} = ProductSlice.actions;
export default ProductSlice;