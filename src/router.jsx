import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { checkUser } from "./components/pages/Login/checkUser";
import AddCategory from "./components/pages/Category/AddCategory";
import ViewCategories from "./components/pages/Category/ViewCategories";
import SingleCategory from "./components/pages/Category/SingleCategory";
import AddPlay from "./components/pages/Plays/AddPlay";
import ViewPlays from "./components/pages/Plays/ViewPlays";

const Layout = lazy(() => import("./components/pages/Layout"));
const Home = lazy(() => import("./components/pages/Home"));
const Login = lazy(() => import("./components/pages/Login"));

function privateRoutes() {
  return [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        // Category
        { path: "/add-category", element: <AddCategory /> },
        { path: "/view-categories", element: <ViewCategories /> },
        { path: "/category", element: <SingleCategory /> },
        // Plays
        { path: "/add-play", element: <AddPlay /> },
        { path: "/view-plays", element: <ViewPlays /> },
      ],
    },
    {
      path: "/login",
      element: <Navigate to="/" />,
    },
  ];
}

function publicRoutes() {
  return [
    {
      path: "/login",
      element: <Login />,
    },
  ];
}

const user = checkUser();

export const router = createBrowserRouter(
  user ? privateRoutes() : publicRoutes()
);
