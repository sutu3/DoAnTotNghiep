import {ImportOrder, ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {Bin} from "@/Store/StackSlice.tsx";
import {UserResponse} from "@/Store/Unit.tsx";
import {createSlice} from "@reduxjs/toolkit";
import {User} from "@/types";

export interface ReceiptItemCreate {
    importItemId: string;        // Bắt buộc
    receivedQuantity: number;    // >= 1
    binLocation?: string;        // Không bắt buộc
    note?: string;               // Không bắt buộc
}
export interface ReceiptWarehouseCreate {
    importOrderId: string;
    note?: string;
    receiptItems: ReceiptItemCreate[];
}
export interface ReceiptItemResponse {
    receiptItemId: string;
    receiptId: string;
    importItemId: string;
    receivedQuantity: number;
    binLocation: string;
    receivedAt: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    // Enriched
    importItem: ImportOrderItem;
    binDetails: Bin;
}
export interface WarehouseReceiptResponse {
    receiptId: string;
    importOrderId: string;
    createdByUser?: User;
    quantityReceiveItem?:number;
    receivedDate: string; // ISO 8601 (LocalDateTime)
    status: "PENDING" | "COMPLETED" | "PARTIAL" | string; // enum ReceiptStatus
    note: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;

    // Enriched
    importOrder: ImportOrder|null;
    createdByUserDetails: UserResponse|null;
    receiptItems?: ReceiptItemResponse[];
}
interface ReceiptWarehouseState {
    warehouseReceiptsResponse: WarehouseReceiptResponse[];
    totalPage: number;
    warehouseReceiptResponse:WarehouseReceiptResponse;
    receiptItem: ReceiptItemCreate[];
    updateItem:ReceiptItemCreate[]
}

const initialState: ReceiptWarehouseState = {
    warehouseReceiptsResponse: [],
    totalPage: 0,
    warehouseReceiptResponse: {
        receiptId: "",
        importOrderId: "",
        receivedDate: "",
        status: "",
        note: "",
        createdAt: "",
        updatedAt: "",
        isDeleted: false,
        importOrder: null,
        createdByUserDetails: null,
        receiptItems: []
    },
    receiptItem:[],
    updateItem:[]
};

const WarehousReceipteSlice = createSlice({
    name: "warehousReceipt",
    initialState,
    reducers: {
        initTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },
        setAddReceiptList: (state, action) => {
            state.receiptItem = action.payload;
        },
        setReceiptWarehouseList: (state, action) => {
            console.log(action.payload);
            state.warehouseReceiptsResponse = action.payload;
        },
        setAddReceiptWarehouses: (state, action) => {
            state.warehouseReceiptsResponse = [...state.warehouseReceiptsResponse, action.payload];
        },
        setReceiptWarehouse: (state, action) => {
            state.warehouseReceiptResponse = action.payload;
        },
        setUpdateReceiptWarehouse: (state, action) => {
            const index = state.warehouseReceiptsResponse.findIndex(
                item => item.receiptId === action.payload.receiptId
            );
            if (index !== -1) {
                state.warehouseReceiptsResponse[index] = action.payload;
            }
        },
    },
});

export const {
    initTotalPage,
    setReceiptWarehouseList,
    setReceiptWarehouse,
    setUpdateReceiptWarehouse,
    setAddReceiptWarehouses,
    setAddReceiptList
} = WarehousReceipteSlice.actions;

export default WarehousReceipteSlice