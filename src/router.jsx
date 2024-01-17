import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Layout = lazy(() => import("./components/pages/Layout"));
const Home = lazy(() => import("./components/pages/Home"));
const Login = lazy(() => import("./components/pages/Login"));

// const App = LazyLoad("../../App.jsx");
// const Dashboard = LazyLoad("../pages/dashboard");
// const Users = LazyLoad("../pages/users");
// const ErrorScreen = LazyLoad("../global/ErrorScreen");
// const AddPlantProduct = LazyLoad("../pages/products/plants/addPlantProducts");
// const ViewPlantProducts = LazyLoad("../pages/products/plants/listProducts");
// const Login = LazyLoad("../pages/login");

function privateRoutes() {
  return {
    path: "/",
    element: <Layout />,
    children: [{ path: "/", element: <Home /> }],
  };
}

function publicRoutes() {
  return {
    path: "/login",
    element: <Login />,
  };
}

const user = localStorage.getItem("auth_token");

export const router = createBrowserRouter([
  user ? privateRoutes() : publicRoutes(),
]);
