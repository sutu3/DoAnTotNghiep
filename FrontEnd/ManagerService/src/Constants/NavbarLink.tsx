import { ManagerLink } from "@/Constants/ManagerLink.tsx";
import { Staff } from "@/Constants/Staff.tsx";

const userRole = "manage";

export const navbarLinks = userRole === "manager" ? ManagerLink : Staff;
