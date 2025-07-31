import { configureStore } from "@reduxjs/toolkit";

import WarehouseSlice from "@/Store/WarehouseSlice.tsx";
import StackSlice from "@/Store/StackSlice.tsx";
import {fetchApi} from "@/Api/FetchApi.tsx";
import TaskTypeSlice from "@/Store/TaskTypeSlice.tsx";
import TaskSlice from "@/Store/TaskSlice.tsx";
import UserSlice from "@/Store/UserSlice.tsx";
import GroupUnit from "@/Store/GroupUnit.tsx";
import UnitSlice from "@/Store/Unit.tsx";
import CategorySlice from "@/Store/CategorySlice.tsx";
import SupplierSlice from "@/Store/SupplierSlice.tsx";
import ProductSlice from "@/Store/ProductSlice.tsx";
import ImportOrder from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import InventorySlice from "@/Store/InventoryOverView.tsx";
import InventoryWarehouseSlice from "@/Store/InventoryWarehouseSlice.tsx";
import ExportOrderSlice from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import TaskUserSlice from "@/Store/TaskUserSlice.tsx";
import StockMovementSlice from "@/Store/StockMovementSlice.tsx";
import WarehousReceipteSlice from "@/pages/ExecuteImport/Store/WarehouseReceiptSlice.tsx";
import WarehouseDeliverySlice from "@/pages/ExecuteExport/Store/WarehouseDeliverySlice.tsx";

const ThemeReducer = (state = { value: true }, action: any) => {
  switch (action.type) {
    case "light":
      return { value: true };
    case "dark":
      return { value: false };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    warehouseDelivery:WarehouseDeliverySlice.reducer,
    themeReducer: ThemeReducer,
    warehouse: WarehouseSlice.reducer,
    stack: StackSlice.reducer,
    taskType: TaskTypeSlice.reducer,
    users: UserSlice.reducer,
    tasks: TaskSlice.reducer,
    taskUser:TaskUserSlice.reducer,
    groupUnit:GroupUnit.reducer,
    unit:UnitSlice.reducer,
    category:CategorySlice.reducer,
    supplier:SupplierSlice.reducer,
    product:ProductSlice.reducer,
    importOrder:ImportOrder.reducer,
    inventory: InventorySlice.reducer,
    inventoryWarehouse:InventoryWarehouseSlice.reducer,
    stockMovement:StockMovementSlice.reducer,
    exportOrder:ExportOrderSlice.reducer,
    warehousReceipt:WarehousReceipteSlice.reducer
  },
});
export const callApiThunk = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any,
    rejectWithValue?: any
) => {
  try {
    return await fetchApi({ method, url, body });
  } catch (error: any) {
    return rejectWithValue?.(error.message);
  }
};

export default store;
