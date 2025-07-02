// store/supplierStore.ts
import { create } from "zustand";
import {SupplierCreate} from "@/Store/SupplierSlice.tsx";



interface SupplierStore {
    supplier: SupplierCreate;
    setSupplier: (partial: Partial<SupplierCreate>) => void;
    reset: () => void;
}

const useSupplierStore = create<SupplierStore>((set) => ({
    supplier: {
        urlSupplier: "",
        supplierName: "",
        email: "",
        phoneNumber: "",
        address: "",
        district: "",
        street: "",
        country: "",
        warehouses: "",
    },
    setSupplier: (partial) =>
        set((state) => ({ supplier: { ...state.supplier, ...partial } })),
    reset: () =>
        set(() => ({
            supplier: {
                urlSupplier: "",
                supplierName: "",
                email: "",
                phoneNumber: "",
                address: "",
                district: "",
                street: "",
                country: "",
                warehouses: "",
            },
        })),
}));

export default useSupplierStore;
