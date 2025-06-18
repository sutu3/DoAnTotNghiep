import { configureStore } from "@reduxjs/toolkit";

import WarehouseSlice from "@/Store/WarehouseSlice.tsx";
import StackSlice from "@/Store/StackSlice.tsx";

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
    themeReducer: ThemeReducer,
    warehouse: WarehouseSlice.reducer,
    stack: StackSlice.reducer,
  },
});

export default store;
