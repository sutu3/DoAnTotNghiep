import {createSlice} from "@reduxjs/toolkit";

export const columns = [
    { name: "GroupName", uid: "groupName", sortable: true },
    { name: "Description", uid: "description", sortable: true },
    { name: "Unit Ratio", uid: "baseUnitRatio", sortable: true },
    { name: "Unit Type", uid: "unitType", sortable: false },
    { name: "Create By", uid: "createByUser", sortable: false },
    { name: "Create At", uid: "createdAt", sortable: false },
    {name:"Action", uid: "action", sortable: false },
];
export interface UserResponse {
    userId: string;
    userName: string;
    email: string;
    urlImage: string;
}
export interface GroupUnitCreate {
    groupName: string,
    description: string,
    baseUnitRatio: number,
    unitType: string,
    createByUser: string
}
export interface GroupUnit {
    groupUnitID: string;
    groupName: string;
    description: string;
    baseUnitRatio: number;
    unitType: 'Length'|'Quantity'|'Volume'|'Weight'|null;
    createByUser: UserResponse;
    createdAt: Date;
}

export interface GroupUnitState {
    groupUnitList: GroupUnit[];
    totalPage: 0,
    groupUnit: GroupUnit;
}
const initialState:GroupUnitState = {
    groupUnitList: [],
    totalPage:0,
    groupUnit: {
        groupUnitID: "",
        groupName: "",
        description: "",
        baseUnitRatio: 0,
        unitType: null,
        createByUser: {
            userId: "",
            userName: "",
            email: "",
            urlImage: ""
        },
    },
};
const GroupUnitSlice = createSlice({
    name: "groupUnit",
    initialState,
    reducers: {
        initToTalPage: (state, action) => {
            state.totalPage = action.payload || 0;
        },
        setUnitGroup: (state, action) => {
            state.groupUnitList = action.payload;
        },
    },
});
export const { initToTalPage,setUnitGroup } = GroupUnitSlice.actions;
export default GroupUnitSlice;