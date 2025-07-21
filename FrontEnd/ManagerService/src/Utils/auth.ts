import {API_ROUTES} from "@/Api/UrlApi.tsx";

export const getUserRoleFromToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const scope = payload.scope || "";
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();

        // Check if token is expired
        if (exp < now) {
            console.log("Token expired, attempting refresh...");

            try {
                // Call refresh token API
                const response = await fetch(API_ROUTES.Authen.Authen().refresh, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token })
                });

                if (response.ok) {
                    const data = await response.json();
                    const newToken = data.Result.token;

                    // Update localStorage with new token
                    localStorage.setItem("token", newToken);

                    // Decode new token to get role
                    const newPayload = JSON.parse(atob(newToken.split('.')[1]));
                    const newScope = newPayload.scope || "";

                    if (newScope.includes("ROLE_MANAGER")) return "manager";
/*
                    if (newScope.includes("ROLE_STAFF")) return "staff";
*/

                    return null;
                } else {
                    // Refresh failed, remove token and redirect to login
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return null;
                }
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("token");
                window.location.href = "/login";
                return null;
            }
        }
        console.log(scope.includes("ROLE_MANAGER"))
        // Token is still valid, return role
        if (scope.includes("ROLE_MANAGER")) return "manager";
        if (scope.includes("ROLE_STAFF")) return "staff";

        return null;
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return null;
    }
};