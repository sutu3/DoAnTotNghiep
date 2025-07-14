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
    createByUser: string;
    expiredDate?:string,
}

export const mapImportItemToRequest = (
    item: ImportItemCreate,
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
        expiredDate:item.expiryDate
    };
};
