import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import RouteError from "./pages/RouteError";
import PageLayout from "./layouts/PageLayout.jsx";
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
      path:"orders",
      element:<Orders />
    },
    {
      //Unmatched URLs render inside the layout so the nav and footer stay put
      path:"*",
      element:<NotFound />
    }
  ]
  },
]);
