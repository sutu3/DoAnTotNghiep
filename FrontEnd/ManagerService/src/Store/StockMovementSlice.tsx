import {createSlice} from "@reduxjs/toolkit";
import {Product} from "@/Store/ProductSlice.tsx";
import {User} from "@/types";

export interface StockMovement {
    stockMovementId: string;
    inventoryWarehouseId: string;
    product: string;
    movementType: "IMPORT" | "EXPORT" | "TRANSFER" | "ADJUSTMENT";
    quantity: number;
    quantityBefore: number;
    quantityAfter: number;
    referenceOrderId?: string;
    performedBy?: string;
    performedByUser?:User;
    productDetails:Product

    note?: string;
    unitCost?: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface StockMovementCreate {
    inventoryWarehouseId: string;
    product: string;
    movementType: string;
    quantity: number;
    referenceOrderId?: string;
    performedBy?: string;
    note?: string;
    unitCost?: number;
}

interface StockMovementState {
    stockMovements: StockMovement[];
    totalPage: number;
    stockMovementEdit: StockMovement;
    stockMovementCreate: StockMovementCreate;
}

const initialState: StockMovementState = {
    stockMovements: [],
    totalPage: 0,
    stockMovementEdit: {
        stockMovementId: "",
        inventoryWarehouseId: "",
        product: "",
        movementType: "IMPORT",
        quantity: 0,
        quantityBefore: 0,
        quantityAfter: 0,
        createdAt: null,
        updatedAt: null,
    },
    stockMovementCreate: {
        inventoryWarehouseId: "",
        product: "",
        movementType: "IMPORT",
        quantity: 0,
    },
};

const StockMovementSlice = createSlice({
    name: "stockMovement",
    initialState,
    reducers: {
        initTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },
        setStockMovementList: (state, action) => {
            state.stockMovements = action.payload;
        },
        setAddStockMovement: (state, action) => {
            state.stockMovements = [...state.stockMovements, action.payload];
        },
        setUpdateStockMovement: (state, action) => {
            const index = state.stockMovements.findIndex(
                item => item.stockMovementId === action.payload.stockMovementId
            );
            if (index !== -1) {
                state.stockMovements[index] = action.payload;
            }
        },
        setStockMovementEdit: (state, action) => {
            state.stockMovementEdit = action.payload;
        },
    },
});

export const {
    initTotalPage,
    setStockMovementList,
    setAddStockMovement,
    setUpdateStockMovement,
    setStockMovementEdit,
} = StockMovementSlice.actions;

export default StockMovementSlice;