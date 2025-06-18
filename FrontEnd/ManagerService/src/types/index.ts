import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export interface Warehouse {
  warehouseId: string;
  warehouseName: string;
  address: string;
  street: string;
  district: string;
  country: string;
  managerId: string;
}
export interface User {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  urlImage: string;
  phoneNumber: string;
  status: "Active" | "InActive";
  taskUsers: [];
  warehouses: Warehouse;
}
