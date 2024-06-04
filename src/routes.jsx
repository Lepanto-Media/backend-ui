import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ErrorPage from "./components/pages/ErrorPage";
import ViewOrders from "./components/pages/Orders/ViewOrders";
import SingleOrder from "./components/pages/Orders/SingleOrder";
import ListUsers from "./components/pages/Users/ListUsers";
import ViewUser from "./components/pages/Users/ViewUser";
import AddUser from "./components/pages/Users/AddUser";
const AddCategory = lazy(() =>
  import("./components/pages/Category/AddCategory")
);
const ViewCategories = lazy(() =>
  import("./components/pages/Category/ViewCategories")
);
const SingleCategory = lazy(() =>
  import("./components/pages/Category/SingleCategory")
);
const AddPlay = lazy(() => import("./components/pages/Plays/AddPlay"));
const ViewPlays = lazy(() => import("./components/pages/Plays/ViewPlays"));
const SinglePlay = lazy(() => import("./components/pages/Plays/SinglePlay"));

const Layout = lazy(() => import("./components/pages/Layout"));
const Home = lazy(() => import("./components/pages/Home"));
const Login = lazy(() => import("./components/pages/Login"));

const ViewCoupons = lazy(() =>
  import("./components/pages/Coupons/ViewCoupons")
);
const AddCoupon = lazy(() => import("./components/pages/Coupons/AddCoupon"));
const SingleCoupon = lazy(() =>
  import("./components/pages/Coupons/SingleCoupon")
);
export function privateRoutes() {
  return {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      // Category
      { path: "/add-category", element: <AddCategory /> },
      { path: "/view-categories", element: <ViewCategories /> },
      { path: "/category", element: <SingleCategory /> },

      //coupons
      { path: "/view-coupons", element: <ViewCoupons /> },
      { path: "/add-coupon", element: <AddCoupon /> },
      { path: "/coupon", element: <SingleCoupon /> },
      // Plays
      { path: "/add-play", element: <AddPlay /> },
      { path: "/view-plays", element: <ViewPlays /> },
      { path: "/play", element: <SinglePlay /> },
      // Orders
      { path: "/all-orders", element: <ViewOrders /> },
      { path: "/order", element: <SingleOrder /> },
      // Users
      { path: "/view-users", element: <ListUsers /> },
      { path: "/users", element: <ViewUser /> },
      { path: "/add-user", element: <AddUser /> },
      // Login
      { path: "/login", element: <Navigate to="/" /> },
      { path: "*", element: <ErrorPage item="Page" /> },
    ],
  };
}

export function publicRoutes() {
  return [
    {
      path: "/login",
      element: <Login />,
    },
    { path: "*", element: <Navigate to="/login" replace /> },
  ];
}
