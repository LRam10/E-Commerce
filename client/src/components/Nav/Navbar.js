import React, { useEffect, useContext } from "react";
import { Fragment } from "react";
import AuthContext from "../../context/auth/authContext";
import CartContext from "../../context/cart/cartContext";
import DefaultNav from "./DefaultNav";

import CategoryContext from "../../context/category/categoryContext";

const Navbar = () => {
  let size = window.location.origin.length;
  let adminUrl = window.location.href.substring(size, size + 12);
  
  //AuthContext
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;
  //ProductsContext
  const cartContext = useContext(CartContext);
  const { products, createCart, inDB, editCart } = cartContext;
  //Category Context
  const categoryContext = useContext(CategoryContext);
  const { getCategories, categories } = categoryContext;
  useEffect(() => {
    getCategories();
    //eslint-disable-next-line
  }, []);

  const onLogout = () => {
    if (!inDB) createCart(products);
    else editCart(products);

    logout();
  };
  //change current
  if (adminUrl !== `/admin-login`) {
    return (
      <Fragment>
        <DefaultNav
          categories={categories}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
          products={products}
        />
      </Fragment>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg bg-dark py-3">
        <ul className="nav justify-content-end">
          <li className="nav-brand text-dark ml-3 text-primary">Admin Login</li>
        </ul>
      </nav>
    );
  }
};

export default Navbar;
