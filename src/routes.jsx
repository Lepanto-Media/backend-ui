import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ErrorPage from "./components/pages/ErrorPage";

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
      // Plays
      { path: "/add-play", element: <AddPlay /> },
      { path: "/view-plays", element: <ViewPlays /> },
      { path: "/play", element: <SinglePlay /> },

      // Login
      { path: "/login", element: <Navigate to="/" /> },
      { path: "*", element: <ErrorPage item="Pgae" /> },
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
