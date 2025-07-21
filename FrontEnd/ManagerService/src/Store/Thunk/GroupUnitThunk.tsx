import {createAsyncThunk} from "@reduxjs/toolkit";
import {callApiThunk} from "@/Store/Store.tsx";
import {API_ROUTES, pageApi} from "@/Api/UrlApi.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {initToTalPage, setUnitGroup} from "@/Store/GroupUnit.tsx";

export const GetAllGroupUnit = createAsyncThunk(
    "groupUnit/GetAllGroupUnit",
    async (
        { page }: { page: pageApi },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "GET",
            API_ROUTES.product.GroupUnit(page).GetAll,
            undefined,
            rejectWithValue
        )
);

export const MiddleGetAllGroupUnit = (page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(GetAllGroupUnit({ page }));
            dispatch(setUnitGroup(action.payload.result.content));
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