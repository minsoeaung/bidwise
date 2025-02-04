import { createBrowserRouter } from "react-router-dom";
// import { lazy } from "react";
import { ForbiddenPage } from "./Forbidden";
import { AboutPage } from "./About";
import Root from "./Root";
import NotFoundPage from "./NotFound";
import CatalogPage from "./Auctions";
import UserSessionPage from "./UserSession";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <CatalogPage /> },
      { path: "auctions", element: <CatalogPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "user-session", element: <UserSessionPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
