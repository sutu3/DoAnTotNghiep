import { createSlice } from "@reduxjs/toolkit";
import {User, Warehouse} from "@/types";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";
export interface InventoryCheckItem extends InventoryWarehouse {
    systemQuantity: number;
    actualQuantity: number;
    difference: number;
    adjustmentReason?: string;
    checkNotes?: string;
}
export interface InventoryCheckDetailCreate {
    inventoryWarehouseId: string;
    systemQuantity: number;
    actualQuantity: number;
    adjustmentReason: string;
    notes: string;
}
export interface InventoryCheckCreate {
    checkSheetNumber: string;
    warehouse: string;
    notes:string ;
    checkDetails:InventoryCheckDetailCreate[];
}

export interface AdjustmentData {
    quantity: number;
    reason: string;
    notes: string;
}

export interface CheckSheetFormData {
    checkSheetNumber: string;
    warehouse: string;
    notes: string;
    checkDate: string;
    status: 'DRAFT' | 'COMPLETED' | 'APPROVED';
}


export interface InventoryCheckDetail {
    checkDetailId: string;
    checkSheetId: string; // để map với InventoryCheckSheet
    inventoryWarehouseId: string;
    systemQuantity: number;
    actualQuantity: number;
    difference: number;
    adjustmentReason?: string;
    notes?: string;
    inventoryWarehouseDetails: InventoryWarehouse;
}

export interface InventoryCheckSheet {
    checkSheetId: string;
    checkSheetNumber: string;
    warehouse: string;
    performedBy: string;
    checkDate: string; // ISO 8601 (LocalDateTime)
    status: "DRAFT" | "COMPLETED" | "APPROVED" | string;
    notes?: string;
    attachmentUrl?: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;

    // Enriched
    performedByDetails?: User;
    checkDetails: InventoryCheckDetail[];
    warehouseDetails?:Warehouse;
}

interface InventoryCheckState {
    checkSheets: InventoryCheckSheet[];
    totalPage: number;
    currentCheckSheet: InventoryCheckSheet;
    checkDetails: InventoryCheckDetail[];
    updatedCheckDetails: InventoryCheckDetail[];
}

const initialState: InventoryCheckState = {
    checkSheets: [],
    totalPage: 0,
    currentCheckSheet: {
        checkSheetId: "",
        checkSheetNumber: "",
        warehouse: "",
        performedBy: "",
        checkDate: "",
        status: "DRAFT",
        notes: "",
        attachmentUrl: "",
        createdAt: "",
        updatedAt: "",
        isDeleted: false,
        performedByDetails: undefined,
        checkDetails: [],
    },
    checkDetails: [],
    updatedCheckDetails: [],
};

const InventoryCheckSlice = createSlice({
    name: "inventoryCheck",
    initialState,
    reducers: {
        setTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },
        setCheckSheets: (state, action) => {
            state.checkSheets = action.payload;
        },
        addCheckSheet: (state, action) => {
            state.checkSheets=state.checkSheets.length!=0?[...state.checkSheets,action.payload]:action.payload;
        },
        setCurrentCheckSheet: (state, action) => {
            state.currentCheckSheet = action.payload;
        },
        updateCheckSheet: (state, action) => {
            const index = state.checkSheets.findIndex(
                item => item.checkSheetId === action.payload.checkSheetId
            );
            if (index !== -1) {
                state.checkSheets[index] = action.payload;
            }
        },
        setCheckDetails: (state, action) => {
            state.checkDetails = action.payload;
        },
        setUpdatedCheckDetails: (state, action) => {
            state.updatedCheckDetails = action.payload;
        },
    },
});

export const {
    setTotalPage,
    setCheckSheets,
    addCheckSheet,
    setCurrentCheckSheet,
    updateCheckSheet,
    setCheckDetails,
    setUpdatedCheckDetails
} = InventoryCheckSlice.actions;

export default InventoryCheckSlice;