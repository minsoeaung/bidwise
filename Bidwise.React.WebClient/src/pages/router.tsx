import { createBrowserRouter } from "react-router-dom";
import { ForbiddenPage } from "./Forbidden";
import Root from "./Root";
import NotFoundPage from "./NotFound";
import CatalogPage from "./Auctions";
import { lazy } from "react";

const CreateAuctionPage = lazy(() => import("./Auctions/CreateAuction"));
const AuctionDetailPage = lazy(() => import("./Auctions/AuctionDetail"));
const AboutPage = lazy(() => import("./About"));
const UserSessionPage = lazy(() => import("./UserSession"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <CatalogPage /> },
      { path: "auctions", element: <CatalogPage /> },
      { path: "auctions/create", element: <CreateAuctionPage /> },
      { path: "auctions/:id", element: <AuctionDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "user-session", element: <UserSessionPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
