import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import PageLayout from "./layouts/PageLayout.jsx";
export const Router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element:<PageLayout/>,
    children:[{
      index:true,
      element:<Home />
    }]
  },
]);