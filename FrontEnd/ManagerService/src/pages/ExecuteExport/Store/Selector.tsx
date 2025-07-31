export const DeliveryWarehouseSelector = (state: { warehouseDelivery: {deliveries: any} }) =>
    state.warehouseDelivery.deliveries;
export const TotalPageReceipt = (state: { warehouseDelivery: { totalPage: number } }) =>
    state.warehouseDelivery.totalPage;
export const ExportItemCreateSelector = (state: { exportOrder: {exportItemCreate:any} }) =>
    state.exportOrder.exportItemCreate;
export const ExportOrderSelector = (state: { exportOrder: {orderExport:any} }) =>
    state.exportOrder.orderExport;
export const ExportOrderItemSelector = (state: { exportOrder: {orderItem:any} }) =>
    state.exportOrder.orderItem;