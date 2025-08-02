import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_ROUTES, pageApi } from '@/Api/UrlApi';
import {
    addCheckSheet,
    InventoryCheckCreate,
    InventoryCheckDetail,
    InventoryCheckDetailCreate,
    InventoryCheckSheet,
    setTotalPage,
    updateCheckSheet
} from '@/pages/InventoryCheck/Store/InventoryCheckSlice';
import {callApiThunk} from "@/Store/Store.tsx";
// @ts-ignore
import {getUserRoleFromToken} from "@/Utils/auth.ts";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

// Get all check sheets
export const getAllCheckSheets = createAsyncThunk(
    'inventoryCheckSheet/getAllCheckSheets',
    async (page: pageApi, { rejectWithValue }) => {
        return await callApiThunk(

            'GET',
                `${API_ROUTES.inventory.checkSheets(page).getAll}`,
            undefined,
            rejectWithValue
    );
    }
);
export const updateCheckSheetsDetail = createAsyncThunk(
    'inventoryCheckSheet/updateCheckSheetsDetail',
    async ({ checkDetailId,payload }: {checkDetailId:string,payload: InventoryCheckDetailCreate} , { rejectWithValue }) => {
        return await callApiThunk(

            'PUT',
            API_ROUTES.inventory.checkDetails(null).update(checkDetailId),
            payload,
            rejectWithValue
        );
    }
);

// Get check sheet by ID
export const getCheckSheetById = createAsyncThunk(
    'inventoryCheckSheet/getCheckSheetById',
    async (checkSheetId: string, { rejectWithValue }) => {
        return await callApiThunk(
            'GET',
            `${API_ROUTES.inventory.checkSheets(null).getById(checkSheetId)}`,
            undefined,
            rejectWithValue
        );
    }
);
export const getCheckSheetByWarehouseId = createAsyncThunk(
    'inventoryCheckSheet/getCheckSheetById',
    async ({warehouseId,page}:{warehouseId: string,page:pageApi}, { rejectWithValue }) => {
        return await callApiThunk(
            'GET',
            API_ROUTES.inventory.checkSheets(page).getAll().byWarehouse(warehouseId),
            undefined,
            rejectWithValue
        );
    }
);
export const getCheckSheetByUser = createAsyncThunk(
    'inventoryCheckSheet/getCheckSheetById',
    async ({page}:{page:pageApi}, { rejectWithValue }) => {
        return await callApiThunk(
            'GET',
            API_ROUTES.inventory.checkSheets(page).getAll().byUser(),
            undefined,
            rejectWithValue
        );
    }
);
// Create new check sheet
export const createInventoryCheckSheet = createAsyncThunk(
    'inventoryCheckSheet/createCheckSheet',
    async ({ payload }: {payload: InventoryCheckCreate}, { rejectWithValue }) => {
        return await callApiThunk(
            'POST',
            API_ROUTES.inventory.checkSheets(null).create,
            payload,
            rejectWithValue
        );
    }
);

// Update check sheet status
export const updateCheckSheetStatusApprove = createAsyncThunk(
    'inventoryCheckSheet/updateCheckSheetStatusApprove',
    async ({ checkSheetId,attachmentUrl }: { checkSheetId: string,attachmentUrl:string }, { rejectWithValue }) => {
        return await callApiThunk(
            'PUT',
            API_ROUTES.inventory.checkSheets(null).updateStatusApprove(checkSheetId),
            {attachmentUrl},
            rejectWithValue
        );
    }
);
export const updateCheckSheetStatusComplete = createAsyncThunk(
    'inventoryCheckSheet/updateCheckSheetStatusComplete',
    async ({ checkSheetId }: { checkSheetId: string }, { rejectWithValue }) => {
        return await callApiThunk(
            'PUT',
            API_ROUTES.inventory.checkSheets(null).updateStatusComplete(checkSheetId),
            undefined,
            rejectWithValue
        );
    }
);
// Process check sheet (approve and create stock movements)
export const processCheckSheet = createAsyncThunk(
    'inventoryCheckSheet/processCheckSheet',
    async (checkSheetId: string, { rejectWithValue }) => {
        return await callApiThunk(
            'POST',
            `${API_ROUTES.inventory.checkSheets(null).process(checkSheetId)}`,
            undefined,
            rejectWithValue
        );
    }
);

// Delete check sheet
export const deleteCheckSheet = createAsyncThunk(
    'inventoryCheckSheet/deleteCheckSheet',
    async (checkSheetId: string, { rejectWithValue }) => {
        return await callApiThunk(
            'DELETE',
            `${API_ROUTES.inventory.checkSheets(null).delete(checkSheetId)}`,
            undefined,
            rejectWithValue
        );
    }
);
export const MiddleAddCheckInventorySheets = (payload: InventoryCheckCreate) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(createInventoryCheckSheet({payload}));
            dispatch(addCheckSheet(action.payload?.result));
            return action;
        } catch (error: any) {
            console.error('Error fetching check sheets:', error);
            throw error;
        }
    };
};
export const MiddleGetWarehouseByUser = (warehouseId:string,page: pageApi) => {
    return async function (dispatch: any) {
        try {
            const role =await getUserRoleFromToken();
            if( role=="manager"){
                const action=await dispatch(getCheckSheetByWarehouseId({warehouseId,page}))
                dispatch(addCheckSheet(action.payload.result.content));
                dispatch(setTotalPage(action.payload.result.totalPages));
            }else{
                const action=await dispatch(getCheckSheetByUser({page}))
                dispatch(addCheckSheet(action.payload.result.content));
                dispatch(setTotalPage(action.payload.result.totalPages));
            }
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
// Middle function for getting all check sheets with pagination
export const MiddleUpdateStatusCompleteCheckSheets = (sheetCheck: InventoryCheckSheet|null) => {
    return async function (dispatch: any) {
        try {
            if(sheetCheck?.status=="DRAFT"){
                const action = await dispatch(updateCheckSheetStatusComplete({checkSheetId:sheetCheck?.checkSheetId}));
                dispatch(updateCheckSheet(action.payload?.result));
            }
        } catch (error: any) {
            console.error('Error fetching check sheets:', error);
            throw error;
        }
    };
};
export const MiddleUpdateStatusApproveCheckSheets = (sheetCheck: InventoryCheckSheet, attachmentUrl:string) => {
    return async function (dispatch: any) {
        try {
            if(sheetCheck?.status=="COMPLETED"){
                const action = await dispatch(updateCheckSheetStatusApprove({checkSheetId:sheetCheck?.checkSheetId,attachmentUrl:attachmentUrl}));
                const updatedCheckSheet= dispatch(updateCheckSheet(action.payload?.result));
                return updatedCheckSheet;
            }
        } catch (error: any) {
            console.error('Error fetching check sheets:', error);
            throw error;
        }
    };
};
export const MiddleUpdateCheckDetails = (
    payload: InventoryCheckDetailCreate,
    checkSheetId: string,
    checkDetailId: string
) => {
    return async (dispatch: any, getState: any) => {
        try {
            const checkSheetList: InventoryCheckSheet[] = getState().inventoryCheck.checkSheets;
            const targetCheckSheet = checkSheetList.find(
                (el) => el.checkSheetId === checkSheetId
            );

            if (targetCheckSheet) {
                const action = await dispatch(updateCheckSheetsDetail({ checkDetailId, payload }));
                const result: InventoryCheckDetail = action.payload.result;

                const updatedCheckSheet: InventoryCheckSheet = {
                    ...targetCheckSheet,
                    checkDetails: targetCheckSheet.checkDetails.map((el) =>
                        el.checkDetailId === checkDetailId ? result : el
                    ),
                };

                dispatch(updateCheckSheet(updatedCheckSheet));
                return updatedCheckSheet;
            }
        } catch (error: any) {
            console.error("Error updating check detail:", error);
            throw error;
        }
    };
};
