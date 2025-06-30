export const warehouseSelector = (state: { warehouse: { warehouse: any } }) =>
  state.warehouse.warehouse;

export const userSelector = (state: { user: { user: any } }) =>
    state.user.user;

export const CategorySelector = (state: { category: { categoryList: any } }) =>
state.category.categoryList;
export const TotalPageCategory = (state: { category: { totalPage: number } }) =>
    state.category.totalPage;

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

export const UnitSelector = (state: { unit: {unitList: any} }) =>
    state.unit.unitList;
export const TotalPageUnit = (state: { unit: { totalPage: number } }) =>
    state.unit.totalPage;

export const GroupUnitSelector = (state: { groupUnit: {groupUnitList: any} }) =>
    state.groupUnit.groupUnitList;
export const TotalPageGroupUnit = (state: { groupUnit: { totalPage: number } }) =>
    state.groupUnit.totalPage;

export const TaskSelector = (state: { tasks: any }) =>
    state.tasks.tasks;
