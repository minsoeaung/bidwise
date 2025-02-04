import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Root from "./Root";
// import { lazy } from "react";
import NotFoundPage from "./NotFound";
import { useAuth } from "../context/AuthContext.tsx";
import CatalogPage from "./Catalog";
import { ForbiddenPage } from "./Forbidden";
import { AboutPage } from "./About";

const ProtectedRoute = ({ onlyFor }) => {
  const { user } = useAuth();

  if (!user || !user.roles.some((role) => onlyFor.includes(role))) {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <CatalogPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
