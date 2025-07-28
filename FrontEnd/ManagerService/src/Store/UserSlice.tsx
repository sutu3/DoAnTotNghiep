import { createSlice} from "@reduxjs/toolkit";
import {Warehouse} from "@/types";


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
export interface UserData {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
  roles:[]
  status: "Active" | "InActive";
  taskUsers: [];
  warehouses: Warehouse;
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
  userList: UserData[];
  totalPage: 0,
  user: UserData;
}

const initialState:UserState = {
  userList: [],
  totalPage:0,
  user: {
    userId: "3126d2f9-3810-44d3-8714-a6870855681d",
    userName: "",
    fullName: "",
    email: "",
    urlImage: "",
    phoneNumber: "",
    status: "Active",
    taskUsers: [],
    warehouses: {
      warehouseId: "",
      warehouseName: "",
      address: "",
      street: "",
      district: "",
      country: "",
      managerId: ""
    }
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
    setUpdateUser:(state, action) => {
      state.userList=state.userList.map((user) =>
          user.userId == action.payload?.userId?action.payload:user);
    }
  },
});
export const { initToTalPage,setUserList,setUpdateUser } = UserSlice.actions;
export default UserSlice;
