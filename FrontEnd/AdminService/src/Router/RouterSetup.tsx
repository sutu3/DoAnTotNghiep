import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "../Pages/LoginPage.tsx";
import {CheckAuth} from "../Utils/CheckAuth.tsx";
import AdminLayout from "@/Layouts/AdminLayout.tsx";
import PageNotFound from "@/Pages/PageNotFound.tsx";

const router=createBrowserRouter([
    {
        path: "/",
        element:<AdminLayout/>,
        loader:CheckAuth,
        children:[
            { path: "*", element: <PageNotFound /> },
        ]
    },{
        path:"/login",
        element:<LoginPage/>
    }

])
export default function RouterSetup() {
    return <RouterProvider router={router} />;
}