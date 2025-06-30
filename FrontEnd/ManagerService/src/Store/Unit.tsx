import GroupUnitSlice, {GroupUnit, GroupUnitState} from "@/Store/GroupUnit.tsx";
import {createSlice} from "@reduxjs/toolkit";
export interface UserResponse {
    userId: string;
    userName: string;
    email: string;
    urlImage: string;
}
export const columns = [
    { name: "Unit Name", uid: "unitName", sortable: true },
    { name: "Short Name", uid: "shortName", sortable: true },
    { name: "Unit Ratio", uid: "ratioToBase", sortable: true },
    { name: "Is Default", uid: "isDefault", sortable: false },
    { name: "Group Unit", uid: "groupUnit", sortable: false },
    { name: "Create By", uid: "createByUser", sortable: false },
    { name: "Create At", uid: "createdAt", sortable: false },
    {name:"Action", uid: "action", sortable: false },
];
export interface Unit{
    unitID: string,
    unitName: string,
    shortName: string,
    ratioToBase: number,
    isDefault: boolean,
    groupUnit: GroupUnit,
    createByUser: UserResponse,
    createdAt: Date,
    updatedAt: Date
}
export interface UnitCreate{
    unitName: string,
    shortName: string,
    RatioToBase: number,
    IsDefault: boolean,
    groupUnit: string,
    createByUser: string
}
export interface UnitState {
    unitList: Unit[];
    totalPage: 0,
    unit: UnitCreate;
}
const initialState:UnitState = {
    unitList: [],
    totalPage:0,
    unit: {
        unitName: "",
        shortName: "",
        RatioToBase: 0,
        IsDefault: false,
        groupUnit: "",
        createByUser: ""

    },
};
const UnitSlice = createSlice({
    name: "unit",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setUnitList: (state, action) => {
            state.unitList = action.payload;
        },
        setAddUnit: (state, action) => {
            state.unitList = [...state.unitList, action.payload];
        }
    },
});
export const { initToTalPage,setUnitList,setAddUnit } = UnitSlice.actions;
export default UnitSlice;