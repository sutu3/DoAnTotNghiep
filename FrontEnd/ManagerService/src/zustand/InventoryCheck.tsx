import { create } from 'zustand';
import {InventoryCheckDetailCreate} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";


interface InventoryCheckStore {
    items: InventoryCheckDetailCreate[];
    addItem: (item: InventoryCheckDetailCreate) => void;
    removeItem: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearItems: () => void;
}

export const useInventoryCheckStore = create<InventoryCheckStore>((set) => ({
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