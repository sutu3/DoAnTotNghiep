export const warehouseSelector = (state: { warehouse: { warehouse: any } }) =>
  state.warehouse.warehouse;
export const warehouseListSelector = (state: { warehouse: { warehouseList: any } }) =>
    state.warehouse.warehouseList;
export const TotalPageWarehouse = (state: { warehouse: { totalPage: number } }) =>
    state.warehouse.totalPage;

// export const userSelector = (state: (state: { taskUser: { taskUsers: any } }) => any) =>
//     state.user.user;

export const CategorySelector = (state: { category: { categoryList: any } }) =>
state.category.categoryList;
export const TotalPageCategory = (state: { category: { totalPage: number } }) =>
    state.category.totalPage;


export const StacksSelector = (state: { stack: { Stacks: any } }) =>
  state.stack.Stacks;
export const TotalPageStack =(state:any)  =>
  state.stack.totalPage;

export const SupplierSelector = (state: { supplier: { suppliers: any } }) =>
    state.supplier.suppliers;
export const TotalPageSelector = (state: { supplier: { totalPage: number } }) =>
    state.supplier.totalPage;

export const ProductSelector = (state: { product: { products: any } }) =>
    state.product.products;
export const TotalPageProduct = (state: { product: { totalPage: number } }) =>
    state.product.totalPage;

export const TotalPageTask = (state: { taskType: { totalPage: number } }) =>
    state.taskType.totalPage;
export const TaskTypeSelector = (state: { taskType: any }) =>
    state.taskType.taskTypes;

export const UsersSelector = (state: { users: {userList: any} }) =>
    state.users.userList;
export const UserSelector = (state: { users: {user: any} }) =>
    state.users.user;
export const TotalPageUser = (state: { users: { totalPage: number } }) =>
    state.users.totalPage;

export const OrderSelector = (state: { importOrder: {orderImport: any} }) =>
    state.importOrder.orderImport;
export const OrderItemSelector = (state: { importOrder: {orderItem: any} }) =>
    state.importOrder.orderItem;
export const TotalPageOrder = (state: { importOrder: { totalPage: number } }) =>
    state.importOrder.totalPage;

export const ReceiptWarehouseSelector = (state: { warehousReceipt: {warehouseReceiptResponse: any} }) =>
    state.warehousReceipt.warehouseReceiptResponse;
export const ReceiptWarehousesSelector = (state: { warehousReceipt: {warehouseReceiptsResponse: any} }) =>
    state.warehousReceipt.warehouseReceiptsResponse;
export const ReceiptItemSelector = (state: { warehousReceipt: {receiptItem: any} }) =>
    state.warehousReceipt.receiptItem;
export const TotalPageReceipt = (state: { warehousReceipt: { totalPage: number } }) =>
    state.warehousReceipt.totalPage;


export const UnitSelector = (state: { unit: {unitList: any} }) =>
    state.unit.unitList;
export const TotalPageUnit = (state: { unit: { totalPage: number } }) =>
    state.unit.totalPage;

export const GroupUnitSelector = (state: { groupUnit: {groupUnitList: any} }) =>
    state.groupUnit.groupUnitList;
export const TotalPageGroupUnit = (state: { groupUnit: { totalPage: number } }) =>
    state.groupUnit.totalPage;
export const StockMovementSelector = (state: { stockMovement: {stockMovements: any} }) =>
    state.stockMovement.stockMovements;
export const TotalPageStockMovement = (state: { stockMovement: { totalPage: number } }) =>
    state.stockMovement.totalPage;
export const TaskSelector = (state: { tasks: any }) =>
    state.tasks.tasks;

export const TaskUserSelector = (state: { taskUser: {taskUsers:any} }) =>
    state.taskUser.taskUsers;

export const InventoryStatsSelector = (state: { inventory: { stats: any } }) =>
    state.inventory.stats;

export const LowStockProductsSelector = (state: { inventory: { lowStockProducts: any } }) =>
    state.inventory.lowStockProducts;

export const ExpiringProductsSelector = (state: { inventory: { expiringProducts: any } }) =>
    state.inventory.expiringProducts;

export const RecentMovementsSelector = (state: { inventory: { recentMovements: any } }) =>
    state.inventory.recentMovements;

export const WarehouseCapacitySelector = (state: { inventory: { warehouseCapacity: any } }) =>
    state.inventory.warehouseCapacity;

export const InventoryLoadingSelector = (state: { inventory: { loading: any } }) =>
    state.inventory.loading;

export const InventoryErrorsSelector = (state: { inventory: { errors: any } }) =>
    state.inventory.errors;
export const InventoryWarehouseSelector = (state: { inventoryWarehouse: { inventoryWarehouses: any } }) =>
    state.inventoryWarehouse.inventoryWarehouses;
export const InventoryProductSelector = (state: { inventoryWarehouse: { inventoryProducts: any } }) =>
    state.inventoryWarehouse.inventoryProducts;