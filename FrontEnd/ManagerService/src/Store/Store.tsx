import { configureStore } from "@reduxjs/toolkit";

const ThemeReducer = (state = { value: true }, action: any) => {
  switch (action.type) {
    case 'light':
      return { value: true };
    case 'dark':
      return { value: false };
    default:
      return state;
  }
};
const store = configureStore({
  reducer: {
    themeReducer: ThemeReducer,
  },
});

export default store;
