import { createSlice } from "@reduxjs/toolkit";
import {Warehouse} from "@/types";
import {user} from "@heroui/theme";

export interface User{
  userId: string,
  userName: string,
  fullName: string,
  email: string,
  urlImage: string,
  phoneNumber: string,
  status: 'Active'|'InActive',
  taskUsers: [],
}
export interface WarehouseState {
  userList: User[];
  user: User;
}

const initialState: WarehouseState = {
  userList: [],
  user: {
    userId: "",
    userName: "",
    fullName: "",
    email: "",
    urlImage: "",
    phoneNumber: "",
    status: "Active",
    taskUsers: [],
  },
};
const WarehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {



  },
  extraReducers: (builder) => {
    builder
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
      });*/
  },
});
export default WarehouseSlice;