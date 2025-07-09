import { create } from 'zustand';
import {ImportItem} from "@/Store/ImportOrder.tsx";



interface ImportOrderState {
    items: ImportItem[];
    addItem: (item: ImportItem) => void;
    removeItem: (itemId: string) => void;
    updateItem: (item: ImportItem) => void;
    clearItems: () => void;
}

export const useImportOrderStore = create<ImportOrderState>((set) => ({
    items: [],

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),

    removeItem: (itemId) =>
        set((state) => ({
            items: state.items.filter((item) => item.itemId !== itemId),
        })),

    updateItem: (updatedItem) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.itemId === updatedItem.itemId ? updatedItem : item
            ),
        })),

    clearItems: () => set({ items: [] }),
}));
