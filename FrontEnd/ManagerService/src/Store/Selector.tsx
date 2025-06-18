export const warehouse = (state: { WarehouseState: { warehouse: any } }) =>
  state.WarehouseState.warehouse;
export const StacksSelector = (state: { stack: { Stacks: any } }) =>
  state.stack.Stacks;
export const TotalPageStack = (state: { stack: { totalPage: number } }) =>
  state.stack.totalPage;
