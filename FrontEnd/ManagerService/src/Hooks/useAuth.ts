import { useState, useEffect } from 'react';
import { getUserRoleFromToken } from '@/utils/auth';

export const useAuth = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            const role = await getUserRoleFromToken(); // ← await để lấy giá trị thực
            console.log(role); // giờ sẽ là "manager"

            setIsAuthenticated(!!token);
            setUserRole(role);
        };

        checkAuth();
    }, []);

    return { userRole, isAuthenticated };
};