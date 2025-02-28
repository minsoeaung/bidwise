import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./NotFound";
import CatalogPage from "./Auctions";
import { lazy } from "react";
import Root from "./Root";

const CreateAuctionPage = lazy(() => import("./Auctions/CreateAuction"));
const AuctionDetailPage = lazy(() => import("./Auctions/AuctionDetail"));
const UserSessionPage = lazy(() => import("./UserSession"));
const WhatIsBidwisePage = lazy(() => import("./WhatIsBidwise"));
const SellerDashboardPage = lazy(() => import("./SellerDashboard"));
const BuyerDashboardPage = lazy(() => import("./BuyerDashboard"));
const ForbiddenPage = lazy(() => import("./Forbidden"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <CatalogPage /> },
      { path: "auctions", element: <CatalogPage /> },
      { path: "auctions/create", element: <CreateAuctionPage /> },
      { path: "auctions/:id", element: <AuctionDetailPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "user-session", element: <UserSessionPage /> },
      { path: "whatis", element: <WhatIsBidwisePage /> },
      { path: "seller-dashboard", element: <SellerDashboardPage /> },
      { path: "buyer-dashboard", element: <BuyerDashboardPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
