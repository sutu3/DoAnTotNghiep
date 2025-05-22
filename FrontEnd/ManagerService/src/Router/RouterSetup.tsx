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
import { Provider } from "react-redux";
import store from "@/Store/Store.tsx";
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
      <Provider store={store}>
      <ProviderUI>{children}</ProviderUI>
      </Provider>
    </HeroUIProvider>
  );
}
