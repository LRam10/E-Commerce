import React from "react";
import { Link } from "react-router-dom";
import { userCartStore } from "../../store/userCartStore";

const Stars = ({ count = 5 }) => (
  <div className="flex items-center gap-[2px]" aria-label={`${count} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`h-4 w-4 ${i < count ? "fill-black" : "fill-neutral-300"}`}
      >
        <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" />
      </svg>
    ))}
  </div>
);

const ProductCard = ({ item }) => {
  const { addToCart } = userCartStore();

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-sol-stroke bg-white">
      <div className="relative h-[260px] rounded-t-card transition-colors group-hover:bg-sol-cream sm:h-[300px] lg:h-[339px]">
        <Link
          to={`/product/${encodeURIComponent(item.name)}`}
          state={{ img_url: item.img_url }}
          className="block h-full rounded-t-card"
        >
          <div className="flex h-full items-center justify-center p-[20px] pb-[75px] sm:p-[24px] sm:pb-[80px] lg:p-6 lg:pb-6">
            <img
              src={item.img_url}
              alt={item.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </Link>

        {/* Touch devices never fire hover, so the button stays visible below lg
            and only becomes a hover/focus reveal on pointer-sized screens. */}
        <button
          onClick={() => addToCart(item)}
          className="absolute inset-x-[17px] bottom-[17px] flex h-[50px] items-center justify-center rounded-[80px] border border-sol-stroke bg-white text-[15px] font-medium text-black transition-[opacity,background-color] duration-200 hover:bg-sol-cream lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100"
        >
          Add to cart
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[16px] border-t border-sol-stroke p-[17px]">
        <div className="flex flex-col gap-[10px]">
          <Stars />
          <div className="flex items-center justify-between gap-4">
            <h4 className="min-w-0 truncate font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black">
              <Link to={`/product/${encodeURIComponent(item.name)}`} className="hover:underline">
                {item.name}
              </Link>
            </h4>
            <span className="shrink-0 font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black">
              &#36;{item.price}
            </span>
          </div>
        </div>
        <span className="text-[14px] capitalize leading-[21px] text-sol-gray">
          {item.category?.replace("-", " ")}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
