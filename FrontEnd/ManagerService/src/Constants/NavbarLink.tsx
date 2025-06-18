import { ManagerLink } from "@/Constants/ManagerLink.tsx";
import { Staff } from "@/Constants/Staff.tsx";

const userRole = "manager";

export const navbarLinks = userRole === "manager" ? ManagerLink : Staff;
