import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useHref,
} from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import { CheckAuth } from "@/Utils/CheckAuth.tsx";
import { ProviderUI } from "@/providerUI.tsx";
import { HeroUIProvider } from "@heroui/system";
import Product from "@/pages/Product/Product.tsx";
import User from "@/pages/User/page.tsx";
import { Provider } from "react-redux";
import store from "@/Store/Store.tsx";
import WarehousePage from "@/pages/Dashboard/page.tsx";
import StackPage from "@/pages/Stack/page.tsx";
import {ToastProvider} from "@heroui/react";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <HeroUIProviderWrapper>
        <AdminLayout children={undefined} />
      </HeroUIProviderWrapper>
    ),
    loader: CheckAuth,
    children: [
      { path: "*", element: <PageNotFound /> },
      { path: "admin/products", element: <Product /> },
      { path: "/admin/users", element: <User /> },
      { path: "/admin/", element: <WarehousePage /> },
      { path: "/admin/tasks", element: <StackPage /> },
    ],
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
      <ToastProvider />
      <Provider store={store}>
      <ProviderUI>{children}</ProviderUI>
      </Provider>
    </HeroUIProvider>
  );
}
