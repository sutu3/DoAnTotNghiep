import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initToTalPage, setAddUnit, setUnitList, UnitCreate} from "@/Store/Unit.tsx";

export const AddUnit = createAsyncThunk(
    "unit/AddUnit",
    async (
        { payload }: { payload: UnitCreate },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "POST",
            API_ROUTES.product.unit(null).addUnit,
            payload,
            rejectWithValue
        )
);
export const MiddleAddUnit = (unitCreate:UnitCreate) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(AddUnit({ payload:{...unitCreate,IsDefault:false} }));
            dispatch(setAddUnit(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const GetAllUnitByIdUnitGroup = createAsyncThunk(
    "unit/GetAllUnitByIdUnitGroup",
    async (
        { page,unitGroupName }: { page: pageApi,unitGroupName: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.unit(page).search().unitGroupName(unitGroupName).GetAll,
            undefined,
            rejectWithValue
        )
);
export const GetAllUnitName = createAsyncThunk(
    "unit/GetAllUnitByIdUnitGroup",
    async (
         _: { },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product
                .unit(null)
                .search()
                .unitName,
            undefined,
            rejectWithValue
        )
);
export const MiddleGetAllUnitName = () => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllUnitName({ }));
            dispatch(setUnitList(action.payload.result));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleGetAllUnit = (page: pageApi,unitGroupName:string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllUnitByIdUnitGroup({ page,unitGroupName }));
            dispatch(setUnitList(action.payload.result.content));
            dispatch(initToTalPage(action.payload.result.totalPages));
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};