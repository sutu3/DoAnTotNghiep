export const InventoryCheckSelector = (state: { inventoryCheck: {checkSheets: any} }) =>
    state.inventoryCheck.checkSheets;
export const TotalPageReceipt = (state: { warehouseDelivery: { totalPage: number } }) =>
    state.warehouseDelivery.totalPage;