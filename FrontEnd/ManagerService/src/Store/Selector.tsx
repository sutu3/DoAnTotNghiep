export const warehouse = (state: { WarehouseState: { warehouse: any } }) =>
  state.WarehouseState.warehouse;

export const StacksSelector = (state: { stack: { Stacks: any } }) =>
  state.stack.Stacks;
export const TotalPageStack = (state: { stack: { totalPage: number } }) =>
  state.stack.totalPage;

export const TotalPageTask = (state: { taskType: { totalPage: number } }) =>
    state.taskType.totalPage;
export const TaskTypeSelector = (state: { taskType: any }) =>
    state.taskType.taskTypes;

export const UserSelector = (state: { users: {userList: any} }) =>
    state.users.userList;
export const TotalPageUser = (state: { users: { totalPage: number } }) =>
    state.users.totalPage;

export const TaskSelector = (state: { tasks: any }) =>
    state.tasks.tasks;
