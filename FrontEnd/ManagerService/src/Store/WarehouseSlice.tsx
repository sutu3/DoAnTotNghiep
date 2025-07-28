import {createSlice} from "@reduxjs/toolkit";

export interface Warehouse {
  warehouseId: string;
  warehouseName: string;
  address: string;
  street: string;
  district: string;
  country: string;
}
export interface WarehouseState {
  warehouseList: Warehouse[];
  warehouse: Warehouse;
  totalPage: number;
}
export interface WarehouseCreate {
  warehouseName: string;
  address: string;
  street: string;
  district: string;
  country: string;
  description?: string;
}
const initialState: WarehouseState = {
  warehouseList: [],
  totalPage: 0,
  warehouse: {
    warehouseId: "cd42ab93-f2d7-476e-912e-d3c4efe25e73",
    warehouseName: "Warehouse A",
    address: "181",
    street: "Cao Lỗ",
    district: "quận 8",
    country: "Thành Phố Hồ Chí Minh",
  },
};
const WarehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    setAllWarehouse(state, action) {
      state.warehouseList = action.payload;
    },
    initToTalPage: (state, action) => {
      state.totalPage = action.payload ;
    },
    setWarehouse(state, action) {
      state.warehouse = action.payload;
    },
    setUpdateWarehouse(state, action) {
      state.warehouseList=[...state.warehouseList,action.payload];
    }
  },
  extraReducers: (builder) => {
    builder;

  },
});
export const {initToTalPage,setWarehouse,setAllWarehouse,setUpdateWarehouse} = WarehouseSlice.actions;

export default WarehouseSlice;
