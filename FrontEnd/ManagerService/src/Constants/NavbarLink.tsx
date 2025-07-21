import { ManagerLink } from "@/Constants/ManagerLink.tsx";
import { Staff } from "@/Constants/Staff.tsx";
import {useAuth} from "@/Hooks/useAuth.ts";

const NavbarComponent = () => {
    const { userRole, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login
        return null;
    }

    const navbarLinks = userRole === "manager" ? ManagerLink : Staff;

    // Render navbar với navbarLinks
};
export default NavbarComponent;