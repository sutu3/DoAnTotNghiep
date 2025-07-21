import {ImportItemCreate} from "@/Store/ImportOrder.tsx";

export interface ImportOrderRequest {
    product: string;
    warehouse: string;
    supplier: string;
    unit: string;
    importOrder: string;
    requestQuantity: number;
    note?: string;
    costUnitBase: number;
    expiredDate?:string,
}

export const mapImportItemToRequest = (
    item: ImportItemCreate,
    warehouseId: string,
    importOrderId: string,
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
        expiredDate:item.expiryDate
    };
};
