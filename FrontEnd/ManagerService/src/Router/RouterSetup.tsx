import { RouterProvider, createBrowserRouter, useNavigate, useHref } from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import { CheckAuth } from "@/Utils/CheckAuth.tsx";
import { Provider } from "@/provider.tsx";
import { HeroUIProvider } from "@heroui/system";
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <HeroUIProviderWrapper>
                <AdminLayout children={undefined} />
            </HeroUIProviderWrapper>
        ),
        loader: CheckAuth,
        children: [{ path: "*", element: <PageNotFound /> }],
    },
    { path: "/login", element: <LoginPage /> },
]);

export default function RouterSetup() {
    return <RouterProvider router={router} />;
}

function HeroUIProviderWrapper({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const useHrefFn = (href: string) => useHref(href);

    return (
        <HeroUIProvider navigate={navigate} useHref={useHrefFn}>
            <Provider>{children}</Provider>
        </HeroUIProvider>
    );
}

