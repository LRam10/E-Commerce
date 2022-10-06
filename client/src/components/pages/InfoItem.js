import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AlertContext from "../../context/alerts/alertContext";
import ItemContext from "../../context/item/itemContext";
import CartContext from "../../context/cart/cartContext";


const InfoItem = () => {
  let { name } = useParams();
  const itemContext = useContext(ItemContext);
  const { currentItem, getItemByName } = itemContext;

  const cartContext = useContext(CartContext);
  const alertContext = useContext(AlertContext);
  
  const { addToCart, products } = cartContext;

  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    getItemByName(name);
    // eslint-disable-next-line
  }, [name]);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(products));
    // eslint-disable-next-line
  }, [products]);

  const onMinusItem = () => {
    if (qty === 1) {
      return;
    }
    setQty(qty -1);
  };
  const onPlusItem = () => {
    if (qty === 10) {
      return;
    }
    setQty(qty + 1);
  };
  const onAddToCart = () => {
    currentItem.qty = qty;
    for (let i = 0; i < products.length; i++) {
      if (currentItem._id === products[i]._id) {
        alertContext.setAlert("Item Already in Cart", "danger");
        setInCart(true);
        return;
      }
    }
    if (inCart) return;
    else addToCart(currentItem);
  };

  return (
    <div className="container-fluid">
      {!currentItem ? (
        <div className="mx-auto">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <h3 className="m-3">{currentItem.name}</h3>
          </div>
          <div className="row mt-3">
            <div className="col-xl-6 col-md-6">
              <img
                src={currentItem.img_url}
                alt="item-img"
                height="400"
                width="400"
                className="img-thumbnail my-4 img-fluid"
              ></img>
            </div>
            <div className="col-xl-6 col-md-6">
              <h4 className="m-3">
                <b>${currentItem.price}</b>
              </h4>
              <span className=" small-text ml-3">Quantity</span>
              <div className="btn-group d-block ml-3" role="group">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={onMinusItem}
                >
                  -
                </button>
                <button type="button" className="btn btn-light">
                  {qty}
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={onPlusItem}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-blue btn-large px-2 m-3"
                onClick={onAddToCart}
              >
                Add to Cart<i className="fas fa-shopping-cart"></i>
              </button>
              <div>
                <span className="small-text ml-3 ">
                  <b>Description</b>
                </span>
                <p className="ml-3 text-muted">{currentItem.description}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoItem;
