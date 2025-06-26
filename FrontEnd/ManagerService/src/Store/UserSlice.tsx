import { createSlice} from "@reduxjs/toolkit";


export const columns = [
  { name: "ID", uid: "userId", sortable: true },
  { name: "Username", uid: "userName", sortable: true },
  { name: "Full Name", uid: "fullName", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  { name: "Phone", uid: "phoneNumber", sortable: false },
  { name: "Warehouse", uid: "warehouseName", sortable: false },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];
export interface User {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
  status: "Active" | "InActive";
  taskUsers: [];
}
export interface UserCreate {
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
  warehouses: string;
}
export interface UserState {
  userList: User[];
  totalPage: 0,
  user: User;
}

const initialState:UserState = {
  userList: [],
  totalPage:0,
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
const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initToTalPage: (state, action) => {
      state.totalPage = action.payload || 0;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
});
export const { initToTalPage,setUserList } = UserSlice.actions;
export default UserSlice;
