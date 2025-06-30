import {Unit, UnitCreate} from "@/Store/Unit.tsx";
import {createSlice} from "@reduxjs/toolkit";

export const columns = [
    { name: "Category Name", uid: "categoryName", sortable: true },
    { name: "Description", uid: "description", sortable: true },
    { name: "Warehouses", uid: "warehouseName", sortable: true },
    { name: "Create By User", uid: "createByUser", sortable: false },
    { name: "Create At", uid: "createdAt", sortable: false },
];
export interface WarehouseResponse {
    warehouseName: string;
    managerId: string;

}
export interface UserResponse  {
    userId: string;
    userName: string;
    email: string;
    urlImage: string;
}
export interface CategoryCreate{
    categoryName:string,
    description:string,
    warehouses:string,
    createByUser:string
}
export interface Category{
    categoryId:string,
    categoryName:string,
    description:string,
    warehouses:WarehouseResponse|undefined,
    createByUser:UserResponse|undefined,
    createdAt:Date|undefined
}
export interface CategoryState {
    categoryList: Category[];
    totalPage: 0,
    category: CategoryCreate;
}
const initialState:CategoryState = {
    categoryList: [],
    totalPage:0,
    category: {
        categoryName:"",
        description:"",
        warehouses:"",
        createByUser:""

    },
};
const CategorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setCategoryList: (state, action) => {
            state.categoryList = action.payload;
        },
        setAddCategory: (state, action) => {
            state.categoryList = [...state.categoryList, action.payload];
        }
    },
});
export const {initToTalPage, setAddCategory,setCategoryList} = CategorySlice.actions;
export default CategorySlice;