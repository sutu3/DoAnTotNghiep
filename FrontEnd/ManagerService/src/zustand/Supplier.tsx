// store/supplierStore.ts
import { create } from "zustand";
import {SupplierCreate} from "@/Store/SupplierSlice.tsx";

interface SupplierStore {
    supplier: SupplierCreate;
    setSupplier: (data: Partial<SupplierCreate>) => void;
    resetSupplier: () => void;
}

const defaultSupplier: SupplierCreate = {
    urlSupplier: "",
    supplierName: "",
    email: "",
    phoneNumber: "",
    address: "",
    district: "",
    street: "",
    country: "",
    warehouses: "",
};

export const useSupplierStore = create<SupplierStore>((set) => ({
    supplier: defaultSupplier,

    setSupplier: (data) =>
        set((state) => ({
            supplier: {
                ...state.supplier,
                ...data,
            },
        })),

    resetSupplier: () => set({ supplier: defaultSupplier }),
}));
