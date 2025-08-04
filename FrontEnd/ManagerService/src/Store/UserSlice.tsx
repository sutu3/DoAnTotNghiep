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
export interface UserUpdate{
  dateOfBirth?: string;
  gender?: string;
  homeAddress?: string;
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
}
export interface UserData {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
  roles?:[]
  status?: "Active" | "InActive";
  taskUsers?: [];
  warehouses?: Warehouse;
  dateOfBirth?: string;
  gender?: string;
  homeAddress?: string;
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
  user: UserData|null;
}

const initialState:UserState = {
  userList: [],
  totalPage:0,
  user:null ,
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
    },
    setGetUser:(state, action) => {
        state.user = action.payload || null;
    }
  },
});
export const { initToTalPage,setUserList,setUpdateUser,setGetUser } = UserSlice.actions;
export default UserSlice;
