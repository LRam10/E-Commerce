import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Orders from "./pages/Orders";
import InfoItem from "./components/pages/InfoItem";
import NotFound from "./pages/NotFound";
import RouteError from "./pages/RouteError";
import PageLayout from "./layouts/PageLayout.jsx";
import Checkout, { checkoutLoader } from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
export const Router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element:<PageLayout/>,
    //Catches loader/render errors, the layout itself is gone by this point
    errorElement:<RouteError />,
    children:[{
      index:true,
      element:<Home />
    },
    {
      path:"category/:category",
      element:<Category />
    },
    {
      path:"category",
      element:<Category />
    },
    {
      //Product detail, keyed by name because that is what /items/item/:name looks up
      path:"product/:name",
      element:<InfoItem />
    },
    {
      path:"orders",
      element:<Orders />
    },
    {
      //The loader creates the Checkout Session before the page renders, so the
      //Stripe provider mounts with a client secret already in hand
      path:"checkout",
      element:<Checkout />,
      loader:checkoutLoader
    },
    {
      //Stripe's return_url. Redirect-based methods land here with a session_id and
      //the page reads the outcome from the API, never from the URL
      path:"checkout/success",
      element:<CheckoutSuccess />
    },
    {
      //Unmatched URLs render inside the layout so the nav and footer stay put
      path:"*",
      element:<NotFound />
    }
  ]
  },
]);
