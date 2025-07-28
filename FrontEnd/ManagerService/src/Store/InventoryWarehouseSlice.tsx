import {createSlice} from "@reduxjs/toolkit";
import {Bin} from "@/Store/StackSlice.tsx";
import {Product} from "@/Store/ProductSlice.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

export interface InventoryWarehouse {
    inventoryWarehouseId: string;
    productDetails: Product;
    binDetails: Bin;
    quantity: number;
    expiryDate?: string;
    unitCost?: number;
    inventoryProduct:InventoryProduct;
    warehouseDetails:Warehouse;
    status: "AVAILABLE" | "QUARANTINE" | "RESERVED"|"EXPIRED";
    createdAt: Date | null;
    updatedAt: Date | null;
}
export interface InventoryProduct{
    inventoryProductId:string;
    totalQuantity:number;
    minStockLevel:number;
    maxStockLevel:number;
    lastImportDate:string;
    lastExportDate:string;
    status:string;
    productDetails:Product;
    warehouseDetails:Warehouse;
}
export interface InventoryProductCreate{
    product:string,
    warehouse:string,
    totalQuantity:number,
    minStockLevel:number,
    maxStockLevel:number,
    status:string
}
export interface InventoryWarehouseCreate {
    product: string;
    bin?: string;
    quantity: number;
    expiryDate?: string;
    warehouse:string,
    status:string,
}

interface InventoryWarehouseState {
    inventoryWarehouses: InventoryWarehouse[];
    totalPage: number;
    inventoryWarehouseCreate: InventoryWarehouseCreate;
}

const initialState: InventoryWarehouseState = {
    inventoryWarehouses: [],
    totalPage: 0,
    inventoryWarehouseCreate: {
        product: "",
        bin: "",
        quantity: 0,
        expiryDate: "",
        warehouse:"",
        status:"",
    },
};

const InventoryWarehouseSlice = createSlice({
    name: "inventoryWarehouse",
    initialState,
    reducers: {
        initTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },
        setInventoryWarehouseList: (state, action) => {
            console.log(action.payload);
            state.inventoryWarehouses = action.payload;
        },
        setAddInventoryWarehouse: (state, action) => {
            state.inventoryWarehouses = [...state.inventoryWarehouses, action.payload];
        },
        setUpdateInventoryWarehouse: (state, action) => {
            const index = state.inventoryWarehouses.findIndex(
                item => item.inventoryWarehouseId === action.payload.inventoryWarehouseId
            );
            if (index !== -1) {
                state.inventoryWarehouses[index] = action.payload;
            }
        },
    },
});

export const {
    initTotalPage,
    setInventoryWarehouseList,
    setAddInventoryWarehouse,
    setUpdateInventoryWarehouse,
} = InventoryWarehouseSlice.actions;

export default InventoryWarehouseSlice;