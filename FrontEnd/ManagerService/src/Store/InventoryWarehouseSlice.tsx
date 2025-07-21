import {createSlice} from "@reduxjs/toolkit";
import {Bin} from "@/Store/StackSlice.tsx";
import {Product} from "@/Store/ProductSlice.tsx";

export interface InventoryWarehouse {
    inventoryWarehouseId: string;
    inventoryProduct: string;
    product: Product;
    binDetails: Bin;
    quantity: number;
    expiryDate?: string;
    unitCost?: number;
    status: "ACTIVE" | "INACTIVE" | "EXPIRED";
    createdAt: Date | null;
    updatedAt: Date | null;
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