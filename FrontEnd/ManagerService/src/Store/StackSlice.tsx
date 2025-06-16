import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES, pageApi} from "@/Constants/UrlApi.tsx";
// Kích thước 1 bin
export interface Bin {
    binId: string;
    status: "free" | "loaded"|"empty";
    binCode: string;
    capacity: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}
export const columns = [
    { name: "ID", uid: "stackId", sortable: true },
    { name: "Name", uid: "stackName", sortable: true },
    { name: "Description", uid: "description", sortable: true },
    { name: "Number of Bins", uid: "binCount", sortable: true },
    { name: "Status", uid: "statusStack", sortable: true },
    { name: "Actions", uid: "actions" },
];

export interface StackType {
    stackId: string;
    stackName: string;
    description: string;
    bin: Bin[];
}
export interface StackCreate {
    stackName: string;
    description: string;
    warehouse:string;
}

interface StackState {
    Stacks: StackType[];
    StackEdit: StackType;
    StackCreate: StackCreate;
}

/*
const stacks: StackType[] = [
    {
        stackId: "stack-1",
        stackName: "Stack A",
        description: "Lô hàng A",
        bin: [
            {
                binId: "bin-001",
                binCode: "A-A1",
                status:"loaded",
                capacity: 10,
                createdAt: "2025-06-10T08:00:00Z",
                updatedAt: "2025-06-10T08:00:00Z",
                isDeleted: false,
                deletedAt: null,
            },
            {
                binId: "bin-002",
                binCode: "A-A2",
                capacity: 12,
                status:"free",
                createdAt: "2025-06-10T08:05:00Z",
                updatedAt: "2025-06-10T08:05:00Z",
                isDeleted: false,
                deletedAt: null,
            },
        ],
    },
    {
        stackId: "stack-2",
        stackName: "Stack B",
        description: "Lô hàng B",
        bin: [
            {
                binId: "bin-003",
                binCode: "B-B1",
                capacity: 8,
                status: "loaded",
                createdAt: "2025-06-10T08:10:00Z",
                updatedAt: "2025-06-10T08:10:00Z",
                isDeleted: false,
                deletedAt: null,
            },
            {
                binId: "bin-004",
                binCode: "B-B2",
                capacity: 15,
                status: "loaded",
                createdAt: "2025-06-10T08:15:00Z",
                updatedAt: "2025-06-10T08:15:00Z",
                isDeleted: false,
                deletedAt: null,
            },
        ],
    },
    {
        stackId: "stack-3",
        stackName: "Stack C",
        description: "Lô hàng C",
        bin: [
            {
                binId: "bin-005",
                binCode: "C-C1",
                capacity: 20,
                status: "free",
                createdAt: "2025-06-10T08:20:00Z",
                updatedAt: "2025-06-10T08:20:00Z",
                isDeleted: false,
                deletedAt: null,
            },
        ],
    },
];
*/

const initialState: StackState = {
    Stacks: [],
    StackEdit: {
        stackId: "",
        stackName: "",
        description: "",
        bin: []
    },
    StackCreate: {
        stackName: "",
        description: "",
        warehouse: "",
    }
};
const StackSlice = createSlice({
    name: "stack",
    initialState,
    reducers: {



    },
    extraReducers: (builder) => {
        builder
            .addCase(addStack.fulfilled,(state, action)=>{
                const result=action.payload?.result;
                const StackMapper=mappedStack(result);
                state.Stacks=[...state.Stacks,StackMapper]
            })
            .addCase(GetAllStack.fulfilled,(state,action)=>{
                const result:StackType[]=action.payload?.result?.content;
                state.Stacks=result.map((el:StackType)=>mappedStack(el));
            })

    },
});
export const addStack = createAsyncThunk(
    "stack/addStack",
    async (payload:StackCreate, { rejectWithValue }) => {
        try {
           return await fetchApi({
                method: "POST",
                url: API_ROUTES.warehouse.stack.addStack,
                body: payload ,
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const GetAllStack = createAsyncThunk(
    "stack/getAllStack", // sửa tên action đúng với mục đích
    async (
        {
            warehouseId,
            page,
        }: { warehouseId: string; page: pageApi },
        { rejectWithValue }
    ) => {
        try {
            return await fetchApi({
                method: "GET",
                url: API_ROUTES.warehouse.stack.search(page, warehouseId),
            });
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const mappedStack = (stackFromApi: StackType): StackType => {
    return {
        stackId: stackFromApi.stackId,
        stackName: stackFromApi.stackName,
        description: stackFromApi.description,
        bin: stackFromApi.bin
    };
};

export const MiddleGetAllStack = (page: pageApi) => {
    return async function check(dispatch, getState) {
        try {
            const { warehouse } = getState().warehouse;
            const warehouseId = warehouse?.warehouseId;

            const response=await dispatch(GetAllStack({ warehouseId, page }));
            return response.result;
        } catch (error: any) {
            showToast({
                title: "Error",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
        }
    };
};
export const MiddleAddStack = (payload:StackCreate) => {
    return async function check(dispatch, getState) {
        try {
            const { warehouse } = getState().warehouse;
// Kiểm tra kỹ slice "warehouse" trong root reducer của bạn có field này không
        await dispatch(addStack({...payload, warehouse:warehouse.warehouseId}));
        } catch (error) {
            showToast({
                title: "Error",
                description:`Message :${error}`,
                color: "danger",
            });

        }
    };
};
export default StackSlice;