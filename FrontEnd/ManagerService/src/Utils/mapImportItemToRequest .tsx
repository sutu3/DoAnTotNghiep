import {ImportItem} from "@/Store/ImportOrder.tsx";

export interface ImportOrderRequest {
    product: string;
    warehouse: string;
    supplier: string;
    unit: string;
    importOrder: string;
    requestQuantity: number;
    note?: string;
    costUnitBase: number;
    createByUser: string;
    expiryDate?:string,
}

export const mapImportItemToRequest = (
    item: ImportItem,
    warehouseId: string,
    importOrderId: string,
    userId: string
): ImportOrderRequest => {
    return {
        product: item.product,
        warehouse: warehouseId,
        supplier: item.supplier,
        unit: item.unit,
        importOrder: importOrderId,
        requestQuantity: item.requestQuantity,
        note: item.note,
        costUnitBase: item.costUnitBase,
        createByUser: userId,
        expiryDate:item.expiryDate
    };
};
