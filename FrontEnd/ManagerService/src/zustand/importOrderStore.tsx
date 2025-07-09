import {ImportItemCreate} from "@/Store/ImportOrder.tsx";
import {create} from "zustand";

interface ImportOrderState {
    items: ImportItemCreate[];
    addItem: (item: ImportItemCreate) => void;
    removeItemByIndex: (index: number) => void;
    updateItemByIndex: (index: number, item: ImportItemCreate) => void;
    clearItems: () => void;
}

export const useImportOrderStore = create<ImportOrderState>((set) => ({
    items: [],

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),

    removeItemByIndex: (index) =>
        set((state) => ({
            items: state.items.filter((_, i) => i !== index),
        })),

    updateItemByIndex: (index, newItem) =>
        set((state) => ({
            items: state.items.map((item, i) => (i === index ? newItem : item)),
        })),

    clearItems: () => set({ items: [] }),
}));
