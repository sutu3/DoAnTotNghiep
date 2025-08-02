import { create } from 'zustand';
import {ExportItemCreateUI} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";


interface ExportOrderStore {
    items: ExportItemCreateUI[];
    addItem: (item: ExportItemCreateUI) => void;
    removeItem: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearItems: () => void;
}

export const useExportOrderStore = create<ExportOrderStore>((set) => ({
    items: [],

    addItem: (item) => set((state) => ({
        items: [...state.items, item]
    })),

    removeItem: (index) => set((state) => ({
        items: state.items.filter((_, i) => i !== index)
    })),

    updateQuantity: (index, quantity) => set((state) => ({
        items: state.items.map((item, i) =>
            i === index ? { ...item, quantity } : item
        )
    })),

    clearItems: () => set({ items: [] })
}));