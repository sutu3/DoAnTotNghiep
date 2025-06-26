import { createSlice } from "@reduxjs/toolkit";

export interface Warehouse {
  warehouseId: string;
  warehouseName: string;
  address: string;
  street: string;
  district: string;
  country: string;
  managerId: string;
}
export interface WarehouseState {
  warehouseList: Warehouse[];
  warehouse: Warehouse;
}

const initialState: WarehouseState = {
  warehouseList: [],
  warehouse: {
    warehouseId: "cd42ab93-f2d7-476e-912e-d3c4efe25e73",
    warehouseName: "Warehouse A",
    address: "181",
    street: "Cao Lỗ",
    district: "quận 8",
    country: "Thành Phố Hồ Chí Minh",
    managerId: "",
  },
};
const WarehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
    /* .addCase(DeletePurchaseItem.fulfilled, (state, action) => {
        const index1 = state.OrderPurchase.findIndex(
          (el) => el.status === "Prepare"
        );
        if (index1 !== -1) {
          state.OrderPurchase = state.OrderPurchase.map((el, index) =>
            index === index1
              ? {
                  ...el,
                  purchaseorderitem: state.OrderPurchase[
                    index
                  ].purchaseorderitem.filter(
                    (el1) => el1.purchase_order_items_id != action.payload
                  ),
                }
              : el
          );
        }
        localStorage.setItem(
          "orderPurchase",
          JSON.stringify(state.OrderPurchase)
        );
        https://doantotnghiep-pb6y.onrender.com/api/taskTypes/search/warehouse/cd42ab93-f2d7-476e-912e-d3c4efe25e73/getAll?pageNumber=0&pageSize=8
        https://userservice-kuug.onrender.com/api/taskTypes/search/warehouse/cd42ab93-f2d7-476e-912e-d3c4efe25e73/getAll?pageNumber=0&pageSize=8

      });*/
  },
});

export default WarehouseSlice;
