import { create } from 'zustand';
import {ExportOrderItem} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

// interface DeliveryItem {
//     exportItemId: string;
//     productName: string;
//     sku: string;
//     binLocation: string;
//     binCode: string;
//     deliveredQuantity: number;
//     maxQuantity: number;
//     unitPrice: number;
//     unit: string;
//     note?: string;
// }

interface WarehouseDeliveryStore {
    items: ExportOrderItem[];
    addItem: (item: ExportOrderItem) => void;
    removeItem: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearItems: () => void;
}

export const useWarehouseDeliveryStore = create<WarehouseDeliveryStore>((set) => ({
    items: [],

    addItem: (item) => set((state) => ({
        items: [...state.items, item]
    })),

    removeItem: (index) => set((state) => ({
        items: state.items.filter((_, i) => i !== index)
    })),

    updateQuantity: (index, quantity) => set((state) => ({
        items: state.items.map((item, i) =>
            i === index ? { ...item, deliveredQuantity: quantity } : item
        )
    })),

    clearItems: () => set({ items: [] })
}));