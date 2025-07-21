import {  createSlice } from "@reduxjs/toolkit";
import {Warehouse} from "@/types";

// Kích thước 1 bin
export interface Bin {
  binId: string;
  binCode: string;
  capacity: number;
  currentOccupancy: number;
  status?: "EMPTY"|"FULL"| "MAINTENANCE"|"AVAILABLE"
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
export const columns = [
  { name: "ID", uid: "stackId", sortable: true },
  { name: "Name", uid: "stackName", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Number of Bins", uid: "binCount", sortable: true },
  { name: "Warehouses", uid: "warehouse", sortable: true },
  { name: "Actions", uid: "action" },
];

export interface StackType {
  stackId: string;
  stackName: string;
  description: string;
  bin: Bin[];
  createdAt:Date|null
  warehouse: Warehouse|null;

}
export interface StackCreate {
  stackName: string;
  description: string;
  warehouse: string;
  binQuantity: number
}

interface StackState {
  Stacks: StackType[];
  totalPage: number;
  StackEdit: StackType;
  StackCreate: StackCreate;
}

const initialState: StackState = {
  Stacks: [],
  totalPage: 0,
  StackEdit: {
    stackId: "",
    stackName: "",
    description: "",
    bin: [],
    createdAt:null,
    warehouse:null
  },
  StackCreate: {
    stackName: "",
    description: "",
    warehouse: "",
    binQuantity: 0
  },
};
const StackSlice = createSlice({
  name: "stack",
  initialState,
  reducers: {
    initToTalPage: (state, action) => {
      state.totalPage = action.payload ;
    },
    setStackList: (state, action) => {
      state.Stacks = action.payload;
    },
    setAddStack: (state, action) => {
      state.Stacks = [...state.Stacks, action.payload];
    }
  },
});
export const {initToTalPage,setStackList,setAddStack} = StackSlice.actions;
export default StackSlice;
