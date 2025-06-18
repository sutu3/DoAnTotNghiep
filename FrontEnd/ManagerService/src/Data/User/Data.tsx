import { User } from "@/types";

export const columns = [
  { name: "ID", uid: "userId", sortable: true },
  { name: "Username", uid: "userName", sortable: true },
  { name: "Full Name", uid: "fullName", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  { name: "Phone", uid: "phoneNumber", sortable: false },
  { name: "Warehouse", uid: "warehouseName", sortable: false },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

export const StatusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];
export const objects: User[] = [
  {
    userId: "u001",
    userName: "jdoe",
    fullName: "John Doe",
    email: "jdoe@example.com",
    urlImage: "https://i.pravatar.cc/150?img=3",
    phoneNumber: "0123456789",
    status: "Active",
    taskUsers: [],
    warehouses: {
      warehouseId: "w001",
      warehouseName: "North Warehouse",
      address: "123 Maple Street",
      street: "Maple Street",
      district: "District 1",
      country: "USA",
      managerId: "u001",
    },
  },
  {
    userId: "u002",
    userName: "asmith",
    fullName: "Alice Smith",
    email: "asmith@example.com",
    urlImage: "https://i.pravatar.cc/150?img=5",
    phoneNumber: "0987654321",
    status: "InActive",
    taskUsers: [],
    warehouses: {
      warehouseId: "w002",
      warehouseName: "South Warehouse",
      address: "456 Oak Avenue",
      street: "Oak Avenue",
      district: "District 3",
      country: "USA",
      managerId: "u002",
    },
  },
  {
    userId: "u003",
    userName: "bwayne",
    fullName: "Bruce Wayne",
    email: "bwayne@example.com",
    urlImage: "https://i.pravatar.cc/150?img=7",
    phoneNumber: "0112233445",
    status: "Active",
    taskUsers: [],
    warehouses: {
      warehouseId: "w003",
      warehouseName: "Gotham Storage",
      address: "100 Wayne Manor Drive",
      street: "Wayne Manor Drive",
      district: "District 7",
      country: "USA",
      managerId: "u003",
    },
  },
];
