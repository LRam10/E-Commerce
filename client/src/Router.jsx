import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Orders from "./pages/Orders";
import PageLayout from "./layouts/PageLayout.jsx";
export const Router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element:<PageLayout/>,
    children:[{
      index:true,
      element:<Home />
    },
    {
      path:"category/:category",
      element:<Category />
    },
    {
      path:"orders",
      element:<Orders />
    }
  ]
  },
]);