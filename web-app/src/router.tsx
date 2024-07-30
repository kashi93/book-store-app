import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import PageNotFound from "./components/PageNotFound";
import Book from "./pages/book";
import BookForm from "./pages/book-form";
import AdminZone from "./middleware/AdminZone";
import Order from "./pages/order";
import OrderForm from "./pages/order-form";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Book />
            },
            {
                path: "/book-form/:id?",
                element: <AdminZone><BookForm /></AdminZone>
            },
            {
                path: "/order",
                element: <Order />
            },
            {
                path: "/order-form",
                element: <OrderForm />
            },
            {
                path: "/order-form/:id",
                element: <AdminZone><OrderForm /></AdminZone>
            },
        ]
    },
    {
        path: "*",
        element: <PageNotFound />
    },
]);
