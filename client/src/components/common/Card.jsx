import React from "react";
import { Link } from "react-router-dom";
import ButtonOutline from "./ButtonOutline";
import { userCartStore } from '../../store/userCartStore';
const Card = ({ item }) => {
  const {addToCart} = userCartStore();
  return (
    <div className="border-[1px] border-[#cecece] rounded-[8px] p-2">
      <Link
        to={`/product/${encodeURIComponent(item.name)}`}
        state={{ img_url: item.img_url }}
      >
        <img src={item.img_url} alt={`${item.category}-img`} className="card-img-menu rounded-lg" />
      </Link>

      <div className="flex flex-col bg-white px-3 py-2 gap-4 border-t-[1px] border-[#cecece]">
        <div className="card-text">
          <h4 className="font-semibold">{item.name}</h4>
          <span className="text-[11px] text-slate-400 capitalize">{item.category.replace('-',' ')}</span>
        </div>
        <p className="font-bold text-[16px]"> &#36; {item.price}</p>
        <ButtonOutline text={'Add to cart'} color={'#404040'}  onClick={()=>addToCart(item)}/>
      </div>
    </div>
  );
};
export default Card;
