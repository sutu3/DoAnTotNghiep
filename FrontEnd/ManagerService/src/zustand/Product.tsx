// store/useProductStore.ts
import { create } from "zustand";
// types/Product.ts
export interface ProductCreate {
    productName: string;
    sku: string;
    description: string;
    price: number;
    urlImageProduct: string;
    supplier: string;
    warehouses: string;
    createByUser: string;
    category: string;
    unit: string;
}

interface ProductState {
    product: ProductCreate;
    setProduct: (partial: Partial<ProductCreate>) => void;
    updateField: <K extends keyof ProductCreate>(key: K, value: ProductCreate[K]) => void;
    resetProduct: () => void;
}

const initialState: ProductCreate = {
    productName: "",
    sku: "",
    description: "",
    price: 0,
    urlImageProduct: "",
    supplier: "",
    warehouses: "",
    createByUser: "",
    category: "",
    unit: ""
};

export const useProductStore = create<ProductState>((set) => ({
    product: initialState,
    setProduct: (partial) =>
        set((state) => ({ product: { ...state.product, ...partial } })),
    updateField: (key, value) =>
        set((state) => ({
            product: { ...state.product, [key]: value }
        })),
    resetProduct: () => set({ product: initialState })
}));
