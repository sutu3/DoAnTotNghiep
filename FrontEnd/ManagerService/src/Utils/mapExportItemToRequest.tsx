// utils/mapExportItemToRequest.tsx
import {ExportItemCreate, ExportOrderItem} from "@/Store/ExportOrderSlice.tsx";

export const mapExportOrderItemToCreate = (
    item: ExportOrderItem,
    exportOrderId: string
): ExportItemCreate => {
    return {
        exportOrderId: exportOrderId,
        product: item.product.productId,
        unit: item.unit.unitID,
        binLocation: item.bin?.binId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        batchNumber: item.batchNumber
    };
};

// Hàm chuyển đổi cho array
export const mapExportOrderItemsToCreateList = (
    items: ExportOrderItem[],
    exportOrderId: string
): ExportItemCreate[] => {
    return items.map(item => mapExportOrderItemToCreate(item, exportOrderId));
};